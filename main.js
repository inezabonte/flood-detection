const map = L.map("mapid").setView([-1.9403, 29.8739], 9);

const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const tileUrl =
  "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png";
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(map);

function getColor(d) {
  return d > 25
    ? "#800026"
    : d > 20
      ? "#BD0026"
      : d > 15
        ? "#E31A1C"
        : d > 10
          ? "#FC4E2A"
          : d > 7
            ? "#FD8D3C"
            : d > 4
              ? "#FEB24C"
              : d > 1
                ? "#FED976"
                : "#FFEDA0";
}

function style(feature) {
  var density;
  damages.forEach((element) => {
    if (element.District == feature.properties.NAME_2) {
      density = Number(element.Deaths);
    }
  });
  return {
    fillColor: getColor(density),
    weight: 2,
    opacity: 1,
    color: "white",
    dashArray: "3",
    fillOpacity: 0.7,
  };
}
function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 5,
    color: "#666",
    dashArray: "",
    fillOpacity: 0.7,
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }
  damages.forEach((element) => {
    if (element.District == layer.feature.properties.NAME_2) {
      info.update(element);
    }
  });
}

function resetHighlight(e) {
  geojson.resetStyle(e.target);
  info.update();
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature,
  });
}

geojson = L.geoJson(districts, {
  style: style,
  onEachFeature: onEachFeature,
}).addTo(map);

//Control-----------------------------
var info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create("div", "info"); // create a div with a class "info"
  this.update();
  return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
  this._div.innerHTML =
    "<h4>Rwanda Flood Detection</h4>" +
    (props
      ? "<b>" +
      props.District +
      "</b><br>" +
      props.Deaths +
      " Deaths" +
      "<br>" +
      props.Injured +
      " Injured" +
      "<br>" +
      props.Houses_Damaged +
      " Houses Damaged" +
      "<br>" +
      props.Crops_Ha +
      " Hectares Desroyed" +
      "<br>" +
      props.Livestock +
      " Livestock" +
      "<br>"
      : "Hover over a state");
};

info.addTo(map);

var legend = L.control({ position: "bottomright" });

legend.onAdd = function (map) {
  var div = L.DomUtil.create("div", "info legend"),
    grades = [0, 1, 4, 7, 10, 15, 20, 25],
    labels = [];

  // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' +
      getColor(grades[i] + 1) +
      '"></i> ' +
      grades[i] +
      (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
  }

  return div;
};

legend.addTo(map);