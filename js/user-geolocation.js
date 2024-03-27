// User geolocation marker/icon
const userLocationIcon = L.divIcon({
  html: '<i class="fa-solid fa-circle"></i>',
  iconSize: [30, 30],
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  className: 'map-user-icon-fontawesome'
});

// Define variables for checking user location icon and storing user location
let usermarker;
let userLocationLat = 60.169857;
let userLocationLng = 24.938379;

// Set user icon to Helsinki center by default
addUserOnMap(userLocationLat,userLocationLng);

//Ask user permission for location, if yes get current position
if("geolocation" in navigator){

  navigator.geolocation.getCurrentPosition(function(position){

    // get user location every 5 seconds
    setInterval(() => {

      // remove previous user location icon
      if(usermarker){
        map.removeLayer(usermarker);
      }

      // save current location
      userLocationLat = position.coords.latitude;
      userLocationLng = position.coords.longitude;

      // add user location icon on map
      addUserOnMap(userLocationLat,userLocationLng);

    }, 5000);
  });
}

// Add user icon on map function
function addUserOnMap(posLat,posLng) {
  usermarker = L.marker([posLat,posLng], {icon: userLocationIcon}).addTo(map);
}

// Function on click: Snap/zoom to user location
document.getElementById('user-location').addEventListener('click', function btnUserLocation(){
  map.setView([userLocationLat, userLocationLng], 16);
});