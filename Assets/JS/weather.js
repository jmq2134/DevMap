/// FUNCTION TO RUN DARK SKY IFRAME WEATHER EMBED
function weatherForecast() {

	// queryURL variables
	var city = "Cleveland";
	var apiKey = "AIzaSyDkBhwarrOwSenjAYgGyBi9wUplJnM2JW0";
	var lat = 0;
	var lon = 0;

    // queryURL for JSON request
    var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + city + "&key=" + apiKey;

	console.log(queryURL);

	// ajax request to find lat and long of city variable
	$.ajax({
		url: queryURL,
		method: "GET"
	}).done(function(results) {

		console.log(results);

		lat = results.results[0].geometry.location.lat;
		long = results.results[0].geometry.location.lng;

		console.log(lat);
		console.log(long);

		// create weatherURL
		var weatherURL = "https://forecast.io/embed/#lat=" + lat + "&lon=" + long + "&name=" + city;
		console.log(weatherURL);

		// Add weather URL to iframe
		$("#forecast_embed").attr("src", weatherURL);
	}); // close ajax request

} // Close weather function


weatherForecast();