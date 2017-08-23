// Initialize Firebase
var config = {
    apiKey: "AIzaSyB0-qMVAZlma3NqGdeNa52flabRwVIKyuk",
    authDomain: "clemapper.firebaseapp.com",
    databaseURL: "https://clemapper.firebaseio.com",
    projectId: "clemapper",
    storageBucket: "clemapper.appspot.com",
    messagingSenderId: "935789080806"
  };
firebase.initializeApp(config);

var ref = firebase.database();

// Location array
ref.ref().on("value", function(snapshot) {
    var locations = snapshot.val();
    for (var key in locations) {
        var location = locations[key];
        console.log(location);
        geocodeAddress(location);
    }
})

// Geocode addresses from customer data table on index.html
function geocodeAddress(location) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        'address': location.street1 + ' ' + location.city + ' ' + location.state + ' ' + location.zip
    }, function(results, status) {
        // Drop a pin on map for each geocoded address
        console.log(status);
        if (status == 'OK') {
            window.mapInstance.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: window.mapInstance,
                icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
                animation: google.maps.Animation.DROP,
                position: results[0].geometry.location,
                title: location.name
            });

            // Window labels
            var infowindow =  new google.maps.InfoWindow({
                content: location.name + "<br>" + location.street1 + ' ' + location.street2 + "<br>" + location.city + ' ' + location.state + ' ' + location.zip,
            });

            // Display window labels when marker clicked
            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map, this);
            });
        // Query limit alert    
        if (status == 'OVER_QUERY_LIMIT') {
                setTimeout(function() {
                geocodeAddress(Location);
            }, 5000);

        }

        // Error alert
        } else {
            alert("geocode of " + location.name + " failed: " + status);
        }
    });
}

// Draw radius variables
var map;
var radiusHalfMile;
var radiusMile;
var radiusMileHalf; 

// Map settings
function initMap() {
     map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 41.503575, lng: -81.611931 },
        zoom: 13,
        mapTypeId: 'roadmap'
            });

     // .5 mile radius
     radiusHalfMile = new google.maps.Circle({
        strokeColor: '#76D7C4',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#76D7C4',
        fillOpacity: 0.20,
        map: map,
        center: { lat: 41.503575, lng: -81.611931 },
        radius: 804.672 
     });   

     // 1.0 mile radius
     radiusMile = new google.maps.Circle({
        strokeColor: '#76D7C4',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#76D7C4',
        fillOpacity: 0.20,
        map: map,
        center: { lat: 41.503575, lng: -81.611931 },
        radius: 1609.34   
     });

    // 1.0 mile radius
     radiusMileHalf = new google.maps.Circle({
        strokeColor: '#76D7C4',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#76D7C4',
        fillOpacity: 0.20,
        map: map,
        center: { lat: 41.503575, lng: -81.611931 },
        radius: 2414.02   
     });

    window.mapInstance = map;
};






