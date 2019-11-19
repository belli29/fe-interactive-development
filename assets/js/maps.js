// global variables
var map;
var places;
var infoWindow;
var markers = [];
var autocomplete;
var MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';
var countryRestrict = {
  'country': 'us'
};
var hostnameRegexp = new RegExp('^https?://.+?/');
var countries = {
 'au': {
  center: { lat: -25.3, lng: 133.8 },
  zoom: 4
 },
 'br': {
  center: { lat: -14.2, lng: -51.9 },
  zoom: 3
 },
 'ca': {
  center: { lat: 62, lng: -110.0 },
  zoom: 3
 },
 'fr': {
  center: { lat: 46.2, lng: 2.2 },
  zoom: 5
 },
 'de': {
  center: { lat: 51.2, lng: 10.4 },
  zoom: 5
 },
 'mx': {
  center: { lat: 23.6, lng: -102.5 },
  zoom: 4
 },
 'nz': {
  center: { lat: -40.9, lng: 174.9 },
  zoom: 5
 },
 'it': {
  center: { lat: 41.9, lng: 12.6 },
  zoom: 5
 },
 'za': {
  center: { lat: -30.6, lng: 22.9 },
  zoom: 5
 },
 'es': {
  center: { lat: 40.5, lng: -3.7 },
  zoom: 5
 },
 'pt': {
  center: { lat: 39.4, lng: -8.2 },
  zoom: 6
 },
 'us': {
  center: { lat: 37.1, lng: -95.7 },
  zoom: 3
 },
 'uk': {
  center: { lat: 54.8, lng: -4.6 },
  zoom: 5
 }
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
// Search for hotels in the selected city, within the viewport of the map.


function addResult(result, i) {
  var results = document.getElementById('results');
  var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
  var markerIcon = MARKER_PATH + markerLetter + '.png';
  var tr = document.createElement('tr');
  tr.style.backgroundColor = (i % 2 === 0 ? '#007EA7' : '#00A7E1');
  tr.onclick = function() {
    google.maps.event.trigger(markers[i], 'click');
  };
  createTable(markerIcon, result, tr);

};
// Creating the table
function tableHeader() {
  $("#tHeading").html("<tr><th></th><th>Name</th><th>Address</th><th>Rating</th></tr>");
};

function createTable(markerIcon, result, tr) {
  if ($("#tHeading").children().length === 0) {
    tableHeader();
  };
  var iconTd = document.createElement('td');
  var nameTd = document.createElement('td');
  var addressTd = document.createElement('td');
  var ratingTd = document.createElement('td');
  var icon = document.createElement('img');
  icon.src = markerIcon;
  icon.setAttribute('class', 'placeIcon');
  icon.setAttribute('className', 'placeIcon');
  var name = document.createTextNode(result.name);
  var address = document.createTextNode(result.vicinity);
  var rating = document.createTextNode(result.rating.toFixed(1));
  iconTd.appendChild(icon);
  nameTd.appendChild(name);
  addressTd.appendChild(address);
  if (result.rating) {
    ratingTd.appendChild(rating)
  };
  tr.appendChild(iconTd);
  tr.appendChild(nameTd);
  tr.appendChild(addressTd);
  tr.appendChild(ratingTd);
  results.appendChild(tr);
};

function buildIWContent(place) {
  document.getElementById('iw-icon').innerHTML = '<img class="hotelIcon" ' +
    'src="' + place.icon + '"/>';
  document.getElementById('iw-url').innerHTML = '<b><a href="' + place.url +
    '">' + place.name + '</a></b>';
  document.getElementById('iw-address').textContent = place.vicinity;
  if (place.formatted_phone_number) {
    document.getElementById('iw-phone-row').style.display = '';
    document.getElementById('iw-phone').textContent =
      place.formatted_phone_number;
  } else {
    document.getElementById('iw-phone-row').style.display = 'none';
  }
  // Assign a five-star rating to the hotel, using a black star ('&#10029;')
  // to indicate the rating the hotel has earned, and a white star ('&#10025;')
  // for the rating points not achieved.
  if (place.rating) {
    var ratingHtml = '';
    for (var i = 0; i < 5; i++) {
      if (place.rating < (i + 0.5)) {
        ratingHtml += '&#10025;';
      } else {
        ratingHtml += '&#10029;';
      }
      document.getElementById('iw-rating-row').style.display = '';
      document.getElementById('iw-rating').innerHTML = ratingHtml;
    }
  } else {
    document.getElementById('iw-rating-row').style.display = 'none';
  };

  if (place.website) {
          var fullUrl = place.website;
          var website = hostnameRegexp.exec(place.website);
          if (website === null) {
            website = 'http://' + place.website + '/';
            fullUrl = website;
          }
          document.getElementById('iw-website-row').style.display = '';
          document.getElementById('iw-website').innerHTML = `<a href="${website}" target="_blank">${website}</a>`;
        } else {
          document.getElementById('iw-website-row').style.display = 'none';
        }

};
// Get the place details for a hotel. Show the information in an info window,
// anchored on the marker for the hotel that the user selected.
function showInfoWindow() {
  var marker = this;
  places.getDetails({
      placeId: marker.placeResult.place_id
    },
    function(place, status) {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        return;
      }
      infoWindow.open(map, marker);
      buildIWContent(place);
    });
};

function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    if (markers[i]) {
      markers[i].setMap(null);
    }
  }
  markers = [];
};

function clearResults() {
  $("#tHeading").empty();
  $("#results").empty();
};

function search() {
  var search = {
    bounds: map.getBounds(),
    types: ['lodging']
  };
  var minRating;
  places.nearbySearch(search, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK && $("#autocomplete").val() !== "") {
      clearMarkers();
      clearResults();

      function filterFunc() {
        filterResults = results.filter(function(result) {
          return result.rating !== "indefined" && result.rating > minRating;
        });
        results = filterResults;
      };
      var filterResults;
      if ($("#radio-good").prop("checked") == true) {
        minRating = 4;
        filterFunc()
      } else if ($("#radio-ok").prop("checked") == true) {
        minRating = 3;
        filterFunc()
      } else if ($("#radio-bad").prop("checked") == true) {
        minRating = 2;
        filterFunc()
      }
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
        google.maps.event.addListener(markers[i], 'click', showInfoWindow);
        markers[i].placeResult = results[i];
        setTimeout(dropMarker(i), i * 100);
        addResult(results[i], i);
      }
    }
  });
};

function dropMarker(i) {
  return function() {
    markers[i].setMap(map);
  };
};

//Callback function that creates the map
function initMap() {
  $("#radio-all").prop("checked", true);
  map = new google.maps.Map(document.getElementById("map"), {
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
  infoWindow = new google.maps.InfoWindow({
    content: document.getElementById('info-content')
  });
  // Add a listener to react when the user changes country in autocomplete.
  autocomplete.addListener('place_changed', onPlaceChanged);
  // Add a DOM event listener to react when the user selects a country.
  document.getElementById('country').addEventListener(
    'change', setAutocompleteCountry);
  // Add a DOM event listener to react when the user select a radio button.
  document.getElementById('radio-good').addEventListener('change', onPlaceChanged);
  document.getElementById('radio-ok').addEventListener('change', onPlaceChanged);
  document.getElementById('radio-bad').addEventListener('change', onPlaceChanged);
  document.getElementById('radio-all').addEventListener('change', onPlaceChanged);

  // Set the country restriction based on user input and center-zoom on the country
  function setAutocompleteCountry() {
    setMapCenterZoomRestrictions(document.getElementById('country').value);
    map.setCenter(MapCountryCenter);
    map.setZoom(MapCountryZoom);
    autocomplete.setComponentRestrictions(countryRestrict);
    clearMarkers();
    clearResults();
  };

  function onPlaceChanged() {
    clearMarkers();
    clearResults();
    var place = autocomplete.getPlace();
    if (place.geometry) {
      map.panTo(place.geometry.location);
      map.setZoom(15);
      search();
    } else {
      document.getElementById('autocomplete').placeholder = 'Enter a city';
    }
  }
};
