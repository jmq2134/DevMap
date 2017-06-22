

// Client ID and API key from the Developer Console
var CLIENT_ID = "6812878507-q39q9eq4hnmo7rlpg66vg1anlnii1mv7.apps.googleusercontent.com";

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar";

var authorizeButton = $('#authorize-button');
var signoutButton = $('#signout-button');
var refuseAuth = $('#refuse-button');



/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
	gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
		discoveryDocs: DISCOVERY_DOCS,
		clientId: CLIENT_ID,
		scope: SCOPES
	}).then(function (response) {
		// Listen for sign-in state changes.
		gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

		// Handle the initial sign-in state.
		if(!sessionStorage.getItem('authChecked')){
			updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
			authorizeButton.on('click', handleAuthClick);
			refuseAuth.on('click', handleRefuseClick);
			signoutButton.on('click', handleSignoutClick);
		} else {
			$(document).trigger('calendarAuthorized');
		}

	});
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
	var authInstance = gapi.auth2.getAuthInstance();
	var googleuser = authInstance.currentUser.get();

	if(isSignedIn){
		gapi.client.calendar.calendarList.list().then(function(response){
			sessionStorage.setItem('authChecked', true);
			$(document).trigger('calendarAuthorized');
		}, function(error){
			$('#authorize-button').css('display', 'block');
			$('#signout-button').css('display', 'none');
			$('#refuse-button').css('display', 'block');
			$('#AuthorizeCalModal').modal({backdrop: 'static', show: true});
		})
	} else {
		$('#authorize-button').css('display', 'block');
		$('#signout-button').css('display', 'none');
		$('#refuse-button').css('display', 'block');
		$('#AuthorizeCalModal').modal({backdrop: 'static', show: true});
	}
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
	gapi.auth2.getAuthInstance().signIn()
		.then(function(response){
			sessionStorage.setItem('authChecked', true);
			$(document).trigger('calendarAuthorized');
			$('#AuthorizeCalModal').modal('hide');
		})

}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
	gapi.auth2.getAuthInstance().signOut();
	$('#AuthorizeCalModal').modal('hide');
}

function handleRefuseClick(event){
	sessionStorage.setItem('authChecked', true);
	$('#AuthorizeCalModal').modal('hide');
}