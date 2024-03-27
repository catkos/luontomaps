'use strict';

// Create map and set view to Helsinki
const map = L.map('map', {
  zoomControl: false
}).setView([60.1699, 24.9384], 12);

// Set tile layers to Helsinki city style and add attribution
L.tileLayer('https://tiles.hel.ninja/styles/hel-osm-bright/{z}/{x}/{y}@2x@fi.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Tiles: City of Helsinki'
}).addTo(map);

// Place zoom controls at the bottom right corner
L.control.zoom({
  position: 'bottomright'
}).addTo(map);