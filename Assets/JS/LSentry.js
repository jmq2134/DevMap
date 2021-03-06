$( document ).ready(function() {
// Initialize Firebase
  var config = {
    apiKey: "AIzaSyCZQS80-VsG33HEQWU0cuS5gq_ENmWnFEk",
    authDomain: "lsmapper.firebaseapp.com",
    databaseURL: "https://lsmapper.firebaseio.com",
    projectId: "lsmapper",
    storageBucket: "lsmapper.appspot.com",
    messagingSenderId: "494862326936"
  };
  firebase.initializeApp(config);

// Variables
var database=firebase.database();
var isEdit =0; // to identify if this is editing or adding new user
var dataKeyForEdit ; // keep the key for which child is being edited

// Currency conversion function
function currencyFormat (num) {
    return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}


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
            dateEntered:$("#dateEntered_id").val().trim(),
            dateSold: $("#dateSold_id").val().trim(),
            buildingSF:$("#buildingSF_id").val().trim(),
            acreage:$("#acreage_id").val().trim(),
            salePrice:$("#salePrice_id").val().trim(),
            numUnits:$("#numUnits_id").val().trim(),
            oneBed:$("#oneBed_id").val().trim(),
            twoBed:$("#twoBed_id").val().trim(),
            threeBed:$("#threeBed_id").val().trim(),
            notes:$("#notes_id").val().trim(),
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
            dateEntered:$("#dateEntered_id").val().trim(),
            dateSold:$("#dateSold_id").val().trim(),
            buildingSF:$("#buildingSF_id").val().trim(),
            acreage:$("#acreage_id").val().trim(),
            salePrice:$("#salePrice_id").val().trim(),
            numUnits:$("#numUnits_id").val().trim(),
            oneBed:$("#oneBed_id").val().trim(),
            twoBed:$("#twoBed_id").val().trim(),
            threeBed:$("#threeBed_id").val().trim(),
            notes:$("#notes_id").val().trim(),
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
		var dateEntered = thisObject.dateEntered;
		var dateSold = thisObject.dateSold;
		var salePrice = thisObject.salePrice;	
		var buildingSF = thisObject.buildingSF;
		var acreage = thisObject.acreage;
		var costAcre = (parseInt(salePrice) / parseInt(acreage));
		var numUnits = thisObject.numUnits;
		var costUnit = (parseInt(salePrice) / parseInt(numUnits));
		var oneBed = thisObject.oneBed;
		var twoBed = thisObject.twoBed;
		var threeBed = thisObject.threeBed;
		var notes = thisObject.notes;

		//create field to contain customer information
		var customerInfoTr = $("<tr>");
		var nameTd = $("<td>");
		var addrTd = $("<td>");
		var street1Sp = $("<span>");
		var street2Sp = $("<span>");
		var citySp = $("<span>");
		var stateSp = $("<span>");
		var zipSp = $("<span>");
		var dateEnteredTd = $("<td>");
		var dateSoldTd = $("<td>");
		var salePriceTd = $("<td>");
		var buildingSfTd = $("<td>");
		var acreageTd = $("<td>");
		var costAcreTd = $("<td>");
		var numUnitsTd = $("<td>");
		var costUnitTd = $("<td>");
		var oneBedTd = $("<td>");
		var twoBedTd = $("<td>");
		var threeBedTd = $("<td>");
		var notesTd = $("<td>");

		//save value to data attribute. They will be used in editing mode to preload customer info the pop up window
		nameTd.attr("data-name", name);
		street1Sp.attr("data-name", street1);
		street2Sp.attr("data-name", street2);
		citySp.attr("data-name", city);
		stateSp.attr("data-name", state);
		zipSp.attr("data-name", zip);
		dateEnteredTd.attr("data-name", dateEntered);
		dateSoldTd.attr("data-name", dateSold);
		salePriceTd.attr("data-name", salePrice);
		buildingSfTd.attr("data-name", buildingSF);
		acreageTd.attr("data-name", acreage);
		costAcreTd.attr("data-name", costAcre);
		numUnitsTd.attr("data-name", numUnits);		
		costUnitTd.attr("data-name", costUnit);
		oneBedTd.attr("data-name", oneBed);
		twoBedTd.attr("data-name", twoBed);
		threeBedTd.attr("data-name", threeBed);
		notesTd.attr("data-name", notes).addClass("notes-Td-css");

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
		customerInfoTr.append(dateEnteredTd);
		customerInfoTr.append(dateSoldTd);
		customerInfoTr.append(salePriceTd);
		customerInfoTr.append(buildingSfTd);
		customerInfoTr.append(acreageTd);
		customerInfoTr.append(costAcreTd);
		customerInfoTr.append(numUnitsTd);
		customerInfoTr.append(costUnitTd);
		customerInfoTr.append(oneBedTd);
		customerInfoTr.append(twoBedTd);
		customerInfoTr.append(threeBedTd);
		customerInfoTr.append(notesTd);
		customerInfoTr.append(editTd);
		customerInfoTr.append(removeTd);

		$("#displayCustomerInfo").append(customerInfoTr);

		//Convert to currency
		var saleFormat = currencyFormat(parseInt(salePrice));
		var costUnitFormat = currencyFormat(parseInt(costUnit));
		var costAcreFormat = currencyFormat(parseInt(costAcre));
		var oneBedFormat = currencyFormat(parseInt(oneBed));
		var twoBedFormat = currencyFormat(parseInt(twoBed));
		var threeBedFormat = currencyFormat(parseInt(threeBed));

		//show all infor on main page
		nameTd.html(name);
		street1Sp.html(street1 + '&nbsp');
		street2Sp.html(street2);
		citySp.html(city+',&nbsp');
		stateSp.html(state + '&nbsp');
		zipSp.html(zip);
		dateEnteredTd.html(dateEntered);
		dateSoldTd.html(dateSold);
		salePriceTd.html(saleFormat);
		buildingSfTd.html(buildingSF);
		acreageTd.html(acreage);
		costAcreTd.html(costAcreFormat);
		numUnitsTd.html(numUnits);
		costUnitTd.html(costUnitFormat);
		oneBedTd.html(oneBedFormat);
		twoBedTd.html(twoBedFormat);
		threeBedTd.html(threeBedFormat);
		notesTd.html(notes);
	}
});

// REMOVE BUTTON FUNCTION
$(document).on("click", ".removeClass", function (snap){  //when remove button is clicked
	var street1 = $(this).siblings(":nth-child(2)").children().first(); //find all area that contains address
	var street2 = street1.next();;
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


$(document).on("click", ".editClass", function (snap){  //when edit button is clicked
	isEdit = 1;

	console.log($(this).siblings());

	// Grab info from table row
	var name = $(this).siblings().first(); 
	var street1 = $(this).siblings(":nth-child(2)").children().first(); 
	var street2 = street1.next();
	var city = street2.next().next(); 
	var state = city.next(); 
	var zip = state.next(); 
	var dateEntered = $(this).siblings(":nth-child(3)").first(); 
	var dateSold = $(this).siblings(":nth-child(4)").first(); 
	var buildingSF = $(this).siblings(":nth-child(6)").first(); 
	var acreage = $(this).siblings(":nth-child(7)").first();
	var salePrice = $(this).siblings(":nth-child(5)").first();
	var numUnits = $(this).siblings(":nth-child(9)").first(); 
	var oneBed = $(this).siblings(":nth-child(11)").first(); 
	var twoBed = $(this).siblings(":nth-child(12)").first(); 
	var threeBed = $(this).siblings(":nth-child(13)").first(); 
	var notes = $(this).siblings(":nth-child(14)").first(); 

	// Prefill all the input area for the pop up window
	$("#exampleModalLongTitle").html("Edit Lease Comparable");
	$("#name_id").val(name.attr("data-name"));
	$("#street1_id").val(street1.attr("data-name"));
	$("#street2_id").val(street2.attr("data-name"));
	$("#city_id").val(city.attr("data-name"));
	$("#state_id").val(state.attr("data-name"));
	$("#zip_id").val(zip.attr("data-name"));
	$("#dateEntered_id").val(dateEntered.attr("data-name"));
	$("#dateSold_id").val(dateSold.attr("data-name"));
	$("#buildingSF_id").val(buildingSF.attr("data-name"));
	$("#acreage_id").val(acreage.attr("data-name"));
	$("#salePrice_id").val(salePrice.attr("data-name"));
	$("#numUnits_id").val(numUnits.attr("data-name"));
	$("#oneBed_id").val(oneBed.attr("data-name"));
	$("#twoBed_id").val(twoBed.attr("data-name"));
	$("#threeBed_id").val(threeBed.attr("data-name"));
	$("#notes_id").val(notes.attr("data-name"));

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




