// global variables
var map;
var places;
var markers = [];
var autocomplete;
var MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';
var countryRestrict = {
  'country': 'us'
};
var countries = {
  'au': {
    center: {
      lat: -25.3,
      lng: 133.8
    },
    zoom: 4
  },
  'br': {
    center: {
      lat: -14.2,
      lng: -51.9
    },
    zoom: 3
  },
  'ca': {
    center: {
      lat: 62,
      lng: -110.0
    },
    zoom: 3
  },
};

var MapCountryCenter;
var MapCountryZoom;

function setMapCenterZoomRestrictions(country) {
  if (country == 'all') {
    MapCountryCenter = {
      lat: -34.397,
      lng: 150.644
    };
    MapCountryZoom = 2;
    countryRestrict = {
      'country': []
    }
  } else {
    MapCountryCenter = countries[country].center;
    MapCountryZoom = countries[country].zoom;
    countryRestrict = {
      'country': country
    };
  }
};

function initMap() {

  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 2,
    center: {
      lat: -34.397,
      lng: 150.644
    },
    panControl: false,
    zoomControl: false,
    streetViewControl: false,
  });

  // Create the autocomplete object and associate it with the UI input control.
  // Restrict the search to the default country, and to place type "cities".
  autocomplete = new google.maps.places.Autocomplete(
    (document.getElementById('autocomplete')), {
      types: ['(cities)'],
      componentRestrictions: countryRestrict
    });
  places = new google.maps.places.PlacesService(map);

  // Add a listener to react when the user changes country in autocomplete.
  autocomplete.addListener('place_changed', onPlaceChanged);
  // Add a DOM event listener to react when the user selects a country.
  document.getElementById('country').addEventListener(
    'change', setAutocompleteCountry);

  // Set the country restriction based on user input and center-zoom on the country
  function setAutocompleteCountry() {
    setMapCenterZoomRestrictions(document.getElementById('country').value);
    map.setCenter(MapCountryCenter);
    map.setZoom(MapCountryZoom);
    autocomplete.setComponentRestrictions(countryRestrict);
    clearMarkers();
  }

  function onPlaceChanged() {
    var place = autocomplete.getPlace();
    if (place.geometry) {
      map.panTo(place.geometry.location);
      map.setZoom(15);
      search();
    } else {
      document.getElementById('autocomplete').placeholder = 'Enter a city';
    }
  }
  // Search for hotels in the selected city, within the viewport of the map.
  function search() {
    var search = {
      bounds: map.getBounds(),
      types: ['lodging']
    };
    places.nearbySearch(search, function(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        clearMarkers();
        // Create a marker for each hotel found, and
        // assign a letter of the alphabetic to each marker icon.
        for (var i = 0; i < results.length; i++) {
          var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
          var markerIcon = MARKER_PATH + markerLetter + '.png';
          // Use marker animation to drop the icons incrementally on the map.
          markers[i] = new google.maps.Marker({
            position: results[i].geometry.location,
            animation: google.maps.Animation.DROP,
            icon: markerIcon
          });
          // If the user clicks a hotel marker, show the details of that hotel
          // in an info window.
          markers[i].placeResult = results[i];
          setTimeout(dropMarker(i), i * 100);

        }
      }
    });
  }

  function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
      if (markers[i]) {
        markers[i].setMap(null);
      }
    }
    markers = [];
  }

  function dropMarker(i) {
    return function() {
      markers[i].setMap(map);
    };
  }

}
