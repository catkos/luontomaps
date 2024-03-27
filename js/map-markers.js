'use strict';

const luontoreititAPIURL = 'https://citynature.eu/api/wp/v2/places?cityid=5'; // Luontoreitit API's endpoint
let locationGroup = new L.featureGroup(); // Group for locations markers
let pointGroup = new L.featureGroup(); // Group for location's point markers
let routesGroup = new L.featureGroup(); // Group for location's route lines
let routeEndPointMarker; // Route's end point marker

/**
 * Fetches data from Luontoreitit API and adds markers and routes to map
 *
 * @returns {Promise<void>}
 */
async function getLuontoreititAndAddToMap() {
  try {
    // Start fetch from Luontoreitit API
    const response = await fetch(luontoreititAPIURL);
    // If error occurs, give error message
    if (!response.ok) throw new Error('Luontoreitit hakua ei pystytty suorittamaan.');
    // JSON to JavaScript object/array
    const locations = await response.json();

    locations.forEach(location => {
      // Render location (Harakka, Uutela, Seurasaari, etc) markers to map
      renderLocationMarkers(location);
      // Render location's routes to map
      renderRoutes(location);
      // Render location's point markers to map
      renderPointMarkers(location);
    });
  } catch (error) { // Catch error
    console.log(error.message);
  }
}

/**
 * Adds location markers to map and click event listeners to popup's buttons:
 * when clicking, set new zoom level centering on the marker.
 *
 * @param location object/array from Luontoreitit API
 */
function renderLocationMarkers(location) {

  // Location's coordinates
  const lat = +location.points[0].locationPoint.lat;
  const lng = +location.points[0].locationPoint.lng;

  // Custom icon
  const markerIcon = L.divIcon({
    html: '<i class="fa-solid fa-circle"></i>',
    iconSize: [30, 30],
    iconAnchor: [14, 46],
    popupAnchor: [2, -40],
    className: 'map-icon-fontawesome'
  });

  // Set new marker
  const marker = L.marker([lat, lng], {icon: markerIcon});

  // Define popup
  const popup = getPopUp(location.title, 1);
  const btn = popup.querySelector('button')

  // Bind popup to marker
  marker.bindPopup(popup);

  // Add marker to locationGroup and place to map
  locationGroup.addLayer(marker);
  map.addLayer(locationGroup);

  // When clicking, set new lat, lng to map view and zoom level
  btn.addEventListener('click', function() {
    map.setView([lat, lng], 16);
    map.closePopup();
  });
}

/**
 * Places location's point markers to map and click event listener's to
 * popup's button: when clicking, console log lat and lng.
 *
 * @param location object/array from Luontoreitit API
 */
function renderPointMarkers(location) {
  location.points.forEach(point => {

    const lat = +point.locationPoint.lat;
    const lng = +point.locationPoint.lng;

    // If point has pointInfo
    if (point.locationPoint.pointInfo) {

      const info = getPointInfoAsObject(point.locationPoint.pointInfo);

      // Define popup
      const popup = getPopUp(info.title, 2);
      const btn = popup.querySelector('button')
      const h2 = popup.querySelector('h2');
      const content = document.createElement('div');
      content.className = 'popup-content';

      // Check if info has description
      if (info.description) {
        info.description.forEach(text => {
          // Define p tag and append to content
          const p = document.createElement('p');
          p.innerHTML = text;
          content.appendChild(p);
        })
      }

      // Check if info has image
      if (info.image) {
        info.image.forEach(image => {
          // Define figure, image, caption and append to content
          const figure = document.createElement('figure');
          const img = document.createElement('img');
          const caption = document.createElement('caption');
          const captionNode = document.createTextNode(image.description);
          img.src = image.url;
          img.alt = image.description;
          figure.appendChild(img);
          figure.appendChild(caption).appendChild(captionNode);
          content.appendChild(figure);
        })
      }

      // Check if content has nodes, then insert content
      if (content.hasChildNodes()) {
        h2.parentNode.insertBefore(content, h2.nextSibling);
      }

      // Array for keywords found in the title
      const keywords = [
        {
          words:['wc', 'käymälä'],
          icontag: 'fa-solid fa-restroom'
        },
        {
          words:['pysäköinti'],
          icontag: 'fa-solid fa-square-parking'
        },
        {
          words:['opas', 'kartta'],
          icontag: 'fa-solid fa-circle-info'
        },
        {
          words:['kahvila', 'kioski', 'kauppa', 'cafe', 'ravintola'],
          icontag: 'fa-solid fa-mug-saucer'
        },
        {
          words:['metro'],
          icontag: 'fa-solid fa-train-subway'
        },
        {
          words:['uima', 'uinti', 'hiekkapoukama'],
          icontag: 'fa-solid fa-person-swimming'
        },
        {
          words:['keittokatos', 'grilli'],
          icontag: 'fa-solid fa-fire'
        },
        {
          words:['piknik'],
          icontag: 'fa-solid fa-utensils'
        },
        {
          words:['koira'],
          icontag: 'fa-solid fa-dog'
        },
        {
          words:['hiihtoladut'],
          icontag: 'fa-solid fa-person-skiing-nordic'
        },
        {
          words:['esteetön', 'inva'],
          icontag: 'fa-solid fa-wheelchair'
        },
        {
          words:['vesipiste'],
          icontag: 'fa-solid fa-faucet'
        },
        {
          words:['laituri'],
          icontag: 'fa-solid fa-ship'
        },
        {
          words:['suljettu'],
          icontag: 'fa-solid fa-circle-exclamation'
        },
        {
          words:['näköala', 'lintutorni'],
          icontag: 'fa-solid fa-binoculars'
        },
        {
          words:['sauna', 'suihku'],
          icontag: 'fa-solid fa-shower'
        },
        {
          words:['pukukoppi'],
          icontag: 'fa-solid fa-person-booth'
        },
        {
          words:['teltta', 'maja', 'kota'],
          icontag: 'fa-solid fa-campground'
        },
      ];

      const lowercaseTitle = info.title.toLowerCase();

      // Loop keywords array to find match in the title
      const temp = keywords.find(keyword => keyword.words.find(res => lowercaseTitle.includes(res)));

      let fontawesomeIcon;

      // If match is not found, set default icon, otherwise use icontag from the match
      if(!temp) {
        fontawesomeIcon = 'fa-solid fa-circle';
      } else {
        fontawesomeIcon = temp.icontag;
      }

      // Custom icon
      const customIcon = L.divIcon({
        html: '<i class="'+fontawesomeIcon+'"></i>',
        iconSize: [30, 30],
        iconAnchor: [14, 46],
        popupAnchor: [0, -40],
        className: 'map-icon-fontawesome'
      })

      // Define new marker
      const marker = L.marker([lat, lng], {icon: customIcon});

      // Bind popup to marker
      marker.bindPopup(popup);

      // Add marker to pointGroup
      pointGroup.addLayer(marker);

      // Add click event listener to btn: when clicking, get route to the point from user location
      btn.addEventListener('click', function() {
        map.closePopup();
        getRouteToPoint(lat, lng);
      });
    }
  });
}

/**
 * Places route lines to map.
 *
 * @param location object/array from Luontoreitit API
 */
function renderRoutes(location) {
  if (location.routes.features != null) {
    location.routes.features.forEach(route => {
      // All the coordinates in the array are in wrong order,
      // we need to loop through them and reverse the order
      const fixedArray = route.geometry.coordinates.map(coord => coord.reverse());
      // Create polyline from fixedArray, add color to it
      const polyline = L.polyline(fixedArray, {color: '#E36374'});

      // Put polyline to routesGroup
      routesGroup.addLayer(polyline);

      // Calculating the distance of the polyline
      let tempLatLng = null;
      let totalDistance = 0.00000;

      polyline._latlngs.forEach(latlng => {

        if (tempLatLng === null){
          tempLatLng = latlng;
        }

        totalDistance += tempLatLng.distanceTo(latlng);
        tempLatLng = latlng;
      });

      // Define popup
      const popup = getPopUp(((totalDistance) / 1000).toFixed(1) + ' km', 0);

      // Bind popup to marker
      polyline.bindPopup(popup);

      polyline.on('popupopen', function (evt) {
        evt.target.setStyle({
          color: '#111111',
          weight: '4'
        });
        evt.target.bringToFront();
      });

      polyline.on('popupclose', function (evt) {
        evt.target.setStyle({
          color: '#E36374',
          weight: '3'
        });
      });
    });
  }
}

/**
 * Returns popup html element
 *
 * @param title   string - the title of popup
 * @param button  integer - 0: no button. 1: show more button. 2: get directions button
 * @returns {HTMLElement}
 */
function getPopUp(title, button) {
  // Define popup, h2 and btn
  const popup = document.createElement('article');
  const h2 = document.createElement('h2');
  const btn = document.createElement('button');
  let btnNode;
  popup.className = 'popup-article';
  h2.className = 'popup-title';
  btn.className = 'popup-btn';

  // Append h2
  h2.innerHTML = title;
  popup.appendChild(h2);

  switch (button) {
    case 0:
      break;
    case 1:
      btnNode = document.createTextNode('Näytä lisää');
      popup.appendChild(btn).appendChild(btnNode);
      break;
    case 2:
      btnNode = document.createTextNode('Hae reitti');
      popup.appendChild(btn).appendChild(btnNode);
      break;
    default:
      break;
  }

  return popup;
}

/**
 * Returns given string as a JS object/array or null if pointInfo param is empty.
 *
 * @param pointInfo string from Luontoreitit API
 * @returns {{}|null} JS object/array or null
 */
function getPointInfoAsObject(pointInfo) {

  if (pointInfo) {
    // Define info object/array, description and image array
    let info = {};
    let desriptionArr = [];
    let imageArr = [];

    // Define RegEx for splitting and replacing
    let regEx = /<p.*?>|\n\n+|(?=<img.*?>)/g;

    // Split pointInfo into array
    let pointInfoArr = pointInfo.split(regEx)

    pointInfoArr.forEach(pointInfo => {
      regEx = /<\/p>|&nbsp;|\s\s+/g;
      pointInfo = pointInfo.replace(regEx, '');

      // If pointInfo includes 'img'
      if (pointInfo.includes('img')) {
        // Define temporary div tag to insert img html
        const tmp = document.createElement('div');
        tmp.innerHTML = pointInfo;

        // Define img object array, and get url and description from tmp div
        const img = {
          url: tmp.querySelector('img').getAttribute('src'),
          description: tmp.textContent,
        };

        // Push img object array to image array
        imageArr.push(img);
      } else if (pointInfo !== ' ' && pointInfo !== '' && pointInfo !== '\n' && !(pointInfo.includes('Kuuntele'))) {
        // Push pointInfo to descriptionArr
        desriptionArr.push(pointInfo);
      }
    });

    // Define info's title
    info.title = desriptionArr[0];

    // Splice the first index from descriptionArr
    desriptionArr.splice(0, 1);

    // If descriptionArr's length is greater than 0, define info's description
    if (desriptionArr.length > 0) {
      info.description = desriptionArr;
    }

    // If imageArr's length is greater than 0, define info's image
    if (imageArr.length > 0) {
      info.image = imageArr;
    }

    return info;
  } else {
    return null;
  }
}

map.on('zoomend', function() {
  if (map.getZoom() > 13) {
    map.removeLayer(locationGroup);
    map.addLayer(pointGroup);
    map.addLayer(routesGroup);
  } else {
    map.addLayer(locationGroup);
    map.removeLayer(pointGroup);
    map.removeLayer(routesGroup);
  }
});

getLuontoreititAndAddToMap();