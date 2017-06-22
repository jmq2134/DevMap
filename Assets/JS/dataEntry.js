$( document ).ready(function() {
// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDh9kr2548vgUt-s4gexOeDklL2DnWzoGU",
    authDomain: "devmapper-c8415.firebaseapp.com",
    databaseURL: "https://devmapper-c8415.firebaseio.com",
    projectId: "devmapper-c8415",
    storageBucket: "devmapper-c8415.appspot.com",
    messagingSenderId: "119059605410"
  };
  firebase.initializeApp(config);

// Variables
var database=firebase.database();
var isEdit =0; // to identify if this is editing or adding new user
var dataKeyForEdit ; // keep the key for which child is being edited

// Currency conversion function
// function currencyFormat (num) {
//     return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
// }


// $("#phone_id").mask('(000) 000-0000', {clearIfNotMatch: true}); //mask for phone number
$("#zip_id").mask('00000', {clearIfNotMatch: true});	//mask for zip code

//Save button function
$("#saveCustomerInfo").on("click", function(snap){
	// Wait to load
	snap.preventDefault();
	//pop up a "Saved Successfully!" msg for a second and then fade
	var showSaved = $("<p><font color='red'>Saved Successfully!</font></p>").delay(1000).fadeOut(500);
  	$(".modal-footer").prepend(showSaved);

  	/*if isEdit=0 "Save" button will push new child to database. */
		//clean up the the input field after the information are saved

  	if (isEdit==0) {
        var customerData = {
            name:$("#name_id").val().trim(),
            street1:$("#street1_id").val().trim(),
            street2:$("#street2_id").val().trim(),
            city:$("#city_id").val().trim(),
            state:$("#state_id").val().trim(),
            zip:$("#zip_id").val().trim(),
            startDate:$("#startDate_id").val().trim(),
        };

        console.log(customerData);

        database.ref().push(customerData);
	

		$(".modal-form input, .modal-form textarea").val('');
	}

	// if isEdit=1, "save" button will modify existing child
	else {
		database.ref().child(dataKeyForEdit).set({
			name:$("#name_id").val().trim(),
			street1:$("#street1_id").val().trim(),
			street2:$("#street2_id").val().trim(),
			city:$("#city_id").val().trim(),
			state:$("#state_id").val().trim(),
			zip:$("#zip_id").val().trim(),
			startDate:$("#startDate_id").val().trim(),
		});
	}
});


//once the value changes in database, reload all info in the database
database.ref().on("value", function(snap){
	$("#displayCustomerInfo").empty();
	var sv=snap.val();
	for (var key in sv) {
		var thisObject=sv[key];
		//for each child in the database, do the following
		var name = thisObject.name;
		var street1 = thisObject.street1;
		var street2 = thisObject.street2;
		var city = thisObject.city;
		var state = thisObject.state;
		var zip = thisObject.zip;
		var startDate= thisObject.startDate;

		//create field to contain customer information
		var customerInfoTr = $("<tr>");
		var nameTd = $("<td>");
		var addrTd = $("<td>");
		var street1Sp = $("<span>");
		var street2Sp = $("<span>");
		var citySp = $("<span>");
		var stateSp = $("<span>");
		var zipSp = $("<span>");
		var startDateTd = $("<td>");

		//save value to data attribute. They will be used in editing mode to preload customer info the pop up window
		nameTd.attr("data-name", name);
		street1Sp.attr("data-name", street1);
		street2Sp.attr("data-name", street2);
		citySp.attr("data-name", city);
		stateSp.attr("data-name", state);
		zipSp.attr("data-name", zip);
		startDateTd.attr("data-name", startDate );

		//combine street, city, state and zip to a full address
		addrTd.append(street1Sp);
		addrTd.append(street2Sp);
		addrTd.append($("<br>"));
		addrTd.append(citySp);
		addrTd.append(stateSp);
		addrTd.append(zipSp);

		//add edit and remove button for each row
		var editTd = $ ("<button> Edit </button>");
		var removeTd = $("<button> Remove </button>");
		editTd.addClass("editClass"); //add class to edit button
		editTd.attr("data-toggle","modal"); //add attr so that edit can target to the pop up window
		editTd.attr("data-target","#addCustomerModal"); //same as above
		removeTd.addClass("removeClass"); //add class to remove button


		customerInfoTr.append(nameTd);
		customerInfoTr.append(addrTd);
		customerInfoTr.append(startDateTd);
		customerInfoTr.append(editTd);
		customerInfoTr.append(removeTd);

		$("#displayCustomerInfo").append(customerInfoTr);

		//show all infor on main page
		nameTd.html(name);
		street1Sp.html(street1 + '&nbsp');
		street2Sp.html(street2);
		citySp.html(city+',&nbsp');
		stateSp.html(state + '&nbsp');
		zipSp.html(zip);
		startDateTd.html(startDate);
	}
});

// REMOVE BUTTON FUNCTION
$(document).on("click", ".removeClass", function (snap){  //when remove button is clicked
	var street1 = $(this).siblings(":nth-child(4)").children().first(); //find all area that contains address
	var street2 = street1.next();
	var city = street2.next().next();
	var state = city.next();
	var zip = state.next();

	database.ref().once('value').then(function(snapshot) {
		var sv=snapshot.val();
  		for (var key in sv) {  //loop for a match record in database
			var thisObject=sv[key];
			if (thisObject.street1 == street1.attr("data-name") &&
				thisObject.street2 == street2.attr("data-name") &&
				thisObject.city == city.attr("data-name") &&
				thisObject.state == state.attr("data-name") &&
				thisObject.zip == zip.attr("data-name"))   //, if address is the same, the right child is located
			{
				database.ref().child(key).remove(); //remove the child in database
		}
		console.log(sv);
	}
	});
});


$(document).on("click", ".editClass", function (snap){  //when remove button is clicked
	isEdit = 1;

	console.log($(this).siblings());
	
	var name = $(this).siblings().first(); //find info of the row where edit button is clicked, they are used to preload the pop ip window
	var street1 = $(this).siblings(":nth-child(4)").children().first();
	var street2 = street1.next();
	var city = street2.next().next();
	var state = city.next();
	var zip = state.next();
	var startDate = zip.next();

	//prefill all the input area for the pop up window
	$("#exampleModalLongTitle").html("Edit Customer Information");
	$("#name_id").val(name.attr("data-name"));
	$("#street1_id").val(street1.attr("data-name"));
	$("#street2_id").val(street2.attr("data-name"));
	$("#city_id").val(city.attr("data-name"));
	$("#state_id").val(state.attr("data-name"));
	$("#zip_id").val(zip.attr("data-name"));
	$("#startDate_id").val(startDate.attr("data-name"));

	// find the right child in database
	database.ref().once('value').then(function(snapshot) {
		var sv=snapshot.val();
	  	
	  	for (var key in sv) {
			var thisObject=sv[key];

			if (thisObject.street1 == street1.attr("data-name") &&
				thisObject.street2 == street2.attr("data-name") &&
				thisObject.city == city.attr("data-name") &&
				thisObject.state == state.attr("data-name") &&
				thisObject.zip == zip.attr("data-name"))
			{
				dataKeyForEdit = key; // save the key so when "save button" is clicked, it knows where to set database value
				//console.log(dataKeyForEdit);
			}
		}
	});


//when add a customer is clicked, clear all value in pop up window
$("#addCustomer").on("click", function (event){
	event.preventDefault();
	isEdit=0;
	$("#exampleModalLongTitle").html("Add a site");
	$(".modal-form input, .modal-form textarea").val('');

});
    console.log( "ready!" );
});

});




