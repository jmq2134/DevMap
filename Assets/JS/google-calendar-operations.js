
function prepareEventData(customerData) {
    var dfr = $.Deferred();

    var id = localStorage.getItem('calendarId');
    var endDate = moment(customerData.endDate).format('YYYYMMDD');
    var eventDetails = {
        calendarId: id,
        description: customerData.name + '(phone: ' + customerData.phone + ') at ' + customerData.street1 + ' ' + customerData.street2 + ' ' + customerData.city + ' ' + customerData.zip,
        location: customerData.city,
        summary: customerData.name,
        start: {
            "dateTime": moment(customerData.startDate).add(9, 'hour').format(),
            "timeZone": 'America/New_York'
        },
        end: {
            "dateTime": moment(customerData.startDate).add(10, 'hour').format(),
            "timeZone": 'America/New_York'
        },
        recurrence: ["RRULE:FREQ=DAILY;UNTIL=" + endDate + ";INTERVAL=" + customerData.period]
    };
    if (id && eventDetails.hasOwnProperty('description') && eventDetails.hasOwnProperty('end') && eventDetails.hasOwnProperty('start')) {

        createEvent(id, eventDetails)
            .then(function (response) {
                    console.log('createEvent Response', response);
                    dfr.resolve(listUpcomingEvents(id));
                }, function (error) {
                    if (error.hasOwnProperty('allow')) {
                        console.log(error.msg);
                        dfr.reject();
                    }
                }
            );
    }
    return dfr.promise();
}


function createEvent(id, options) {
    var dfr = $.Deferred();
    checkCreatePermissions(id)
        .then(function () {
            console.log(options);
            console.log(options);
            gapi.client.calendar.events.insert(options)
                .then(function (response) {
                    console.log(response);
                    dfr.resolve(response);
                }, function (error) {
                    console.log('error', error);
                    dfr.reject(error);
                })
        }, function (rejected) {
            console.log(rejected);
            dfr.reject({allow: false, msg: rejected});
        });
    return dfr.promise();
}

function checkCreatePermissions(id) {
    var dfr = $.Deferred();
    gapi.client.calendar.calendarList.get({"calendarId": id})
        .then(function (response) {
            console.log('checkCreatePErsmissions response', response);
            switch (response.result.accessRole) {
                case 'reader':
                    dfr.reject('NOT AUTHORIZED TO CREATE EVENTS');
                    break;
                case 'writer':
                    dfr.resolve();
                    break;
                case 'owner':
                    dfr.resolve();
                    break;
                case 'freeBusyReader':
                    dfr.reject('NOT AUTHORIZED TO CREATE EVENTS');
                    break;
                default:
                    dfr.reject('NOT AUTHORIZED TO CREATE EVENTS');
            }
        });
    return dfr.promise();
}


function listUpcomingEvents(calendarId) {
    gapi.client.calendar.events.list({
        'calendarId': calendarId,
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'orderBy': 'startTime'
    }).then(function (response) {
        var events = response.result.items;
        console.log('EventList Response', response);
        if (events.length > 0) {
            parseListedEvents(events);
        } else {
        }
    });
}


function parseListedEvents(events) {
    var day, keys, otherDays = {};
    for (var i = 0; i < events.length; i++) {
        day = events[i].start.dateTime.substring(0, 10);//.format('YYYYMMDD');
        keys = Object.keys(otherDays);
        if (keys.indexOf(day) >= 0) {
            otherDays[day].push(events[i])
        } else {
            otherDays[day] = [events[i]];
        }
    }
    createExtendedEntriesHtml(otherDays)
}


function createExtendedEntriesHtml(additionalEvents) {
    var date, dayToCheck, checkIndex, keys, additionalEventTemplate;
    $('#extended-schedule').empty();
    console.log(additionalEvents);

    keys = Object.keys(additionalEvents);
    for (var j = 0; j < 36; j++) {
        date = moment().add(j, 'days');

        var baseTemplate = '<div class="panel panel-default col-xs-6 col-sm-4 col-md-2">' +
            '<div class="panel-heading 4" id="date-heading-4">' +
            '<div class="dayofmonth">' + date.date() +
            '</div>' +
            '<div class="dayofweek">' + date.format('dddd') +
            '</div>' +
            '<div class="shortdate text-muted">' + date.format('MMM, YYYY') +
            '</div></div>' +
            '<div class="cal-day panel-body" ' +
            'id="date-' + j +
            '"></div></div>';


        dayToCheck = moment(date).format().substring(0, 10);
        console.log(dayToCheck);
        $('#extended-schedule').append(baseTemplate);
        checkIndex = keys.indexOf(dayToCheck);
        console.log(additionalEvents[keys[checkIndex]]);

        if (checkIndex >= 0 && additionalEvents[keys[checkIndex]]) {
            for (var i = 0; i < additionalEvents[keys[checkIndex]].length; i++) {
                additionalEventTemplate = '<p class="cal-entry" ' +
                    'data-date="' + date.format() + '" ' +
                    'data-location="' + additionalEvents[keys[checkIndex]][i].location + '" ' +
                    'data-cal-id="' + additionalEvents[keys[checkIndex]][i].id + '">' +
                    additionalEvents[keys[checkIndex]][i].summary +
                    '</p>' + '<hr>';
                $('#date-' + j).append(additionalEventTemplate);
            }
        }
    }

    $('.cal-entry').on('click', reviewEventHandler)

}


function reviewEventHandler() {
    var eventId, calId;
    $('#calEntryModalBody').empty();
    eventId = $(this).attr('data-cal-id');
    calId = localStorage.getItem('calendarId');
    gapi.client.calendar.events.get({
        'calendarId': calId,
        "eventId": eventId
    }).then(function (response) {
        var event = response.result;
        console.log('Event to Load Response', response);

        $('#calEntryModalTitle').text(moment(event.start.dateTime).format('dddd, MMMM D YYYY'));
        var template = "<p>" + event.description + "</p><p>" + event.location + "</p>";
        $('#update-event').on('click', event, updateEventHandler);
        $('#remove-event').on('click', event, removeEventHandler);
        $('#calEntryModalBody').append(template);
    });
    $('#calEntryModal').modal('show');
}


function updateEventHandler(evt) {
    var update, calId;
    var event = evt.data;
    console.log(evt, event);
    $('#calEntryModal').modal('hide');
    $('#calUpdateModal').modal('show');
    calId = localStorage.getItem('calendarId');
    $('#calUpdateModalTitle').text(moment(event.start.dateTime).format('dddd, MMMM D YYYY'));
    $('#startUpdate_id').val(moment(event.start.dateTime).toISOString().substring(0, 10));
    console.log('Event to Update Response', event);


    $('#saveEventInfo').on('click', function () {
        if ($("#startUpdate_id").val()) {
            update = {
                calendarId: calId,
                eventId: event.id,
                start: {
                    "dateTime": moment($("#startUpdate_id").val().trim()).add(9, 'hour').format(),
                    "timeZone": 'America/New_York'
                },
                end: {
                    "dateTime": moment($("#startUpdate_id").val().trim()).add(10, 'hour').format(),
                    "timeZone": 'America/New_York'
                },
                description: event.description,
                location: event.location,
                summary: event.summary
            };
            gapi.client.calendar.events.update(update).then(function (response) {
                listUpcomingEvents(calId);
                console.log('Event updated Response', response);
                $('#calUpdateModal').modal('hide');
            });
        }

    })
}


function removeEventHandler(evt) {
    var calId, template;
    var event = evt.data;
    $('#calEntryModal').modal('hide');
    $('#calRemoveModal').modal('show');
    $('#calRemoveModalBody').empty();
    calId = localStorage.getItem('calendarId');
    template = "<p>" + event.summary + "</p>" +
        "<p>" + event.description + "</p>" +
        "<p>" + event.location + "</p>";
    console.log(moment(event.start.dateTime).toISOString().substring(0, 10));
    $('#calRemoveModalBody').append(template);
    console.log('Event to Update Response', event);
    $('#removeEventInfo').on('click', function () {
        var remove = {
            calendarId: calId,
            eventId: event.id
        };
        gapi.client.calendar.events.delete(remove).then(function (response) {
            var event = response.result;
            listUpcomingEvents(calId);
            console.log('Event updated Response', response);
            $('#calRemoveModal').modal('hide');
        });


    })
}

