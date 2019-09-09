// global variables
var map;
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

function setMapCenterAndZoom(country) {
  if (country == 'all') {
    MapCountryCenter = {
      lat: -34.397,
      lng: 150.644
    };
    MapCountryZoom= 2;
  } else {
    MapCountryCenter = countries[country].center;
    MapCountryZoom = countries[country].zoom;
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
  // Add a DOM event listener to react when the user selects a country.
  document.getElementById('country').addEventListener(
    'change', setAutocompleteCountry);
  // Set the country restriction based on user input.
  // Also center and zoom the map on the given country.
  function setAutocompleteCountry() {
    setMapCenterAndZoom(document.getElementById('country').value);
    map.setCenter(MapCountryCenter);
    map.setZoom(MapCountryZoom);

  }
};
