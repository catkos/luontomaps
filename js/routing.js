'use strict';

 // Boolean variable for checking if route has been already picked
 let routeFound = false;
 let routeControl;

/**
 * Get route to the selected point
 *
 * @param lat end location's lat
 * @param lng end location's lng
 */
function getRouteToPoint(lat, lng) {

  if (routeFound) { // if route has already been found, remove old route
    removeOldRoute();
    routeFound = false;
  }

  routeControl = L.Routing.control({
    // Set router to use Mapbox
    router: L.routing.mapbox(mapboxApiKey, {profile: 'mapbox/walking'}),
    waypoints: [
      // Star location, user location
      L.latLng(userLocationLat,userLocationLng),
      // End location, point location from 'Reititä kohteeseen' button's eventListener
      L.latLng(lat, lng)
    ],
    lineOptions: {
      styles: [{color: '#111111', weight: 4}]
    },
    fitSelectedRoutes: true, // Fit found route on screen
    addWaypoints: false, // User can't add new waypoints
    createMarker: function() { return null; } // Don't add new markers to map
  }).addTo(map);

  // Routing error
  routeControl.on('routingerror', function(evt){
    console.clear(); //clear console error
    alert('Tälle merkille ei ole mahdollista saada reititystä.');
    return; //stop the function
  });

  routeControl.on('routesfound', function(evt){
    routeFound = true; // change boolean to True

    // Custom icon
    const routeEndPointIcon = L.divIcon({
      html: '<i class="fa-solid fa-circle"></i>',
      iconSize: [30, 30],
      iconAnchor: [14, 46],
      popupAnchor: [0, -40],
      className: 'map-icon-fontawesome'
    })

    // Place marker to the end point
    routeEndPointMarker = L.marker([lat, lng], {icon: routeEndPointIcon}).addTo(map);

    // Delete default container with directions
    const routingContainer = document.querySelector('.leaflet-routing-container');
    routingContainer.remove();

    const routes = evt.routes;
    const summary = routes[0].summary;
    const distance = summary.totalDistance; // In meters
    const time = summary.totalTime; // In seconds

    //Create div
    const routeDiv = document.createElement("div");

    //Add class name (for styling)
    routeDiv.id = "routeInfo";

    //Insert route distance and time and remove route icon
    routeDiv.innerHTML=
    "<h2 id='removeRoute'>Reitti <i class='fa-solid fa-xmark' id='removeRouteIcon'></i></h2>"
    +"<p id='routeNumbers'><i class='fa-solid fa-person-running'></i> "+distanceConverter(distance)
    +"<span id='routeTime'><i class='fa-solid fa-clock'></i> "+timeConverter(time)+"</span></p>";

    //Insert created Div below routeDiv
    document.getElementById("route-div").appendChild(routeDiv);

    //Wake up the routeDiv delete function
    deleteRouteDiv();

  })
}

// Function to return distance in correct convert
function distanceConverter(distance){
  if (distance<1000) { // if under 1000m, return in meters
    return distance.toFixed(0)+' m';
  } else { // otherwise return in km
    return (distance/1000).toFixed(1)+' km';
  }
}

// Function to return time in correct convert
function timeConverter(time){
  if(time<3600){
    return Math.floor(time/60)+' min';
  }else{
    const h = Math.floor(time/3600);
    const m = Math.floor(time/60) - (h*60);
    return h+' h '+m+' min';
  }
}

// If X icon has been clicked, remove route & route info box
function deleteRouteDiv(){
  document.getElementById('removeRouteIcon').addEventListener('click',function btnRouteRemove(){
  routeFound = false; // Set variable to false
  removeOldRoute();
  });
}

/**
 * Removes routeControl from map and removes routeInfo div container
 */
function removeOldRoute() {
  // Deletes created routeInfo box
  const routeInfo = document.getElementById('routeInfo');
  routeInfo.remove();

  // Delete end point marker
  map.removeLayer(routeEndPointMarker);

  // Delete routeControl from map
  map.removeControl(routeControl);
}

