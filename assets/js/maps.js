// Map initialized 
function initMap() {

 var map = new google.maps.Map(document.getElementById("map"), {
  zoom: 2,
  center: { lat: -34.397, lng: 150.644 },
  panControl: false,
  zoomControl: false,
  streetViewControl: false,
 });
}
