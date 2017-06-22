/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */


var calendarCheck, calendarObject;

$(document).one('calendarAuthorized', setup);


function setup() {
    calendarCheck = checkForCalendar();
    calendarCheck.then(
        function (calendarResponse) {
            console.log(calendarResponse);
            if (calendarResponse.hasOwnProperty('id')) {
                console.log('get upcomming events');
                localStorage.setItem('calendarId', calendarResponse.id);
                console.log(window.location.pathname);
                if (/calendar/.test(window.location.pathname)) {
                    console.log('display events');
                    listUpcomingEvents(calendarResponse.id);
                }
            }
        },
        function (result) {
            calendarObject = createSubCalendar();
            console.log('create Calendar calendarObject', calendarObject);
        });
    if (calendarObject) {

    } else {

    }
}

function checkForCalendar() {
    var dfr = $.Deferred();
    var exists = false;
    gapi.client.calendar.calendarList.list()
        .then(function (response) {
            console.log('list Calendars Response', response);
            var calendars = response.result.items;
            for (var i = 0; i < calendars.length; i++) {
                if (calendars[i].summary) {
                    if (calendars[i].summary === "GreatGreenGrass") {
                        // appendPre('Calendar Present');
                        exists = true;
                        dfr.resolve(calendars[i]);
                    }
                }
            }
            if (!exists) {
                dfr.reject('none')
            }
        });

    return dfr.promise();
}


function createSubCalendar() {
    gapi.client.calendar.calendars.insert({summary: "GreatGreenGrass"})
        .then(function (response) {
            console.log('create Calendars Response', response);
            return response.result;
        });
};
