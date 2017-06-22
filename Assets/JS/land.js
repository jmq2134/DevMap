
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

var ref = firebase.database();


// Geocode addresses from customer data table on index.html
function geocodeAddress(location) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        'address': location.street1 + ' ' + location.city + ' ' + location.state + ' ' + location.zip
    }, function(results, status) {
        // Drop a pin on map for each geocoded address
        if (status == 'OK') {
            window.mapInstance.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: window.mapInstance,
                position: results[0].geometry.location,
                title: location.name
            });

            var infowindow =  new google.maps.InfoWindow({
                content: location.name + "<br>" + location.street1 + ' ' + location.street2 + "<br>" + location.city + ' ' + location.state + ' ' + location.zip,
                map: map
            });

            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map, this);
            });

            // Error alert
        } else {
            alert("geocode of " + address + " failed:" + status);
        }
    });
}

// Location array
ref.ref().on("value", function(snapshot) {
    var locations = snapshot.val();
    for (var key in locations) {
        var location = locations[key];

        geocodeAddress(location);
    }
})

// Map settings
function initAutocomplete() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 41.503575, lng: -81.611931 },
        zoom: 13,
        mapTypeId: 'roadmap'
    });
    window.mapInstance = map;
};



