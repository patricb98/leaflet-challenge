// Perform an API call to the earthquake API. Call createMarkers when it completes.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);


// pull in earthquake json data and create circle markers to plot on map 
function createMarkers(response) {
  // pull in earthquake data 
  let earthquakes = response.features;

  // create geojson layer containing earthquake data 
  let earthquakeMarkers = L.geoJSON(earthquakes, {

    // use point to layer function to create circle markers 
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },

    // use style option function to style features/circles 
    style: styleCirle,

    // add pop up earthquake info to circle markers 
    onEachFeature: function(feature, layer) {
      layer.bindPopup(`<h3>Place: ${feature.properties.place}</h3><hr><p>Mag: ${feature.properties.mag}</p><hr><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }
  });
  // Send our earthquakes layer to the createMap function/
  createMap(earthquakeMarkers);
};

// determine style of circle markers 
function styleCirle(feature){
  return {
    fillColor: circleColour (feature.geometry.coordinates[2]),
    fillOpacity: 0.7,
    color: "black",
    radius: circleRadius(feature.properties.mag),
    weight: 0.5
  }
};

// determine the circle radius based on the earthquake magnitude 
function circleRadius(magnitude){
  if (magnitude === 0) {
    return 1;
}
  return magnitude * 3;
}

// determine colour of circle marker based on earthquake depth 
function circleColour(depth) {
  if (depth < 10) {color = "green";}
    else if (depth < 30) {color = "darkseagreen	";}
    else if (depth < 50) {color = "yellow";}
    else if (depth < 70) {color = "darkorange";}
    else if (depth < 90) {color = "indianred";}
    else {color = "maroon";}

  return color;
};

// create function to add circle markers layer to map with legend 
function createMap(earthquakeMarkers) {

    // create the tile layer that will be the background of our map.
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    // create a baseMaps object to hold the streetmap layer.
    let baseMaps = {
      "Street Map": streetmap
    };
  
    // create an overlayMaps object to hold the earthquakeData layer.
    let overlayMaps = {
      "earthquakes": earthquakeMarkers
    };
  
    // create the map object with options.
    let map = L.map("map", {
      center: [16.119149161537838,
        127.06679177664928],
      zoom: 3,
      layers: [streetmap, earthquakeMarkers]
    });

    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);

    // Add legend
    let legend = L.control({position: "bottomright"});
    
    legend.onAdd = function() {
      var div = L.DomUtil.create('div', 'info legend');
      var depth = [-10, 10, 30, 50, 70, 90];
      var labels = [];
      var legendInfo = "<h3 style='text-align: center'>Depth</h3>";
  
      div.innerHTML = legendInfo
  
    
      // loop through depth colour function and push to labels
      for (var i = 0; i < depth.length; i++) {
            labels.push('<ul style="background-color:' + circleColour(depth[i] + 1) + '"> <span>' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '' : '+') + '</ul>');
          }
  
        // add label list to div
        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      
      return div;
    };
  legend.addTo(map)
};

   
  
  