const mymap = L.map("mapid").setView([-1.9403, 29.8739], 9);

const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const tileUrl =
  "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png";
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);

function getColor(d) {
  return d > 20
    ? "#800026"
    : d > 15
    ? "#BD0026"
    : d > 10
    ? "#E31A1C"
    : d > 5
    ? "#FC4E2A"
    : d > 3
    ? "#FD8D3C"
    : d > 2
    ? "#FEB24C"
    : d > 1
    ? "#FED976"
    : "#FFEDA0";
}

$.getJSON(
  "https://raw.githubusercontent.com/inezabonte/flood-detection/main/RW_districts.geojson",
  (data) => {
    L.geoJSON(data, {
      onEachFeature: function (feature, layer) {
        $.getJSON("damages.json", (data) => {
          let density;
          $.each(data, (key, object) => {
            if (object.District == feature.properties.NAME_2) {
              density = parseInt(object.Deaths, 10);
            }
          });
          style(density);
        });
      },
    });
  }
);

function style(density) {
  console.log(density);
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
  info.update(layer.feature.properties);
}

function resetHighlight(e) {
  geojson.resetStyle(e.target);

  info.update();
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

var info = L.control();

info.onAdd = function (map) {
  this._div = L.DomUtil.create("div", "info"); // create a div with a class "info"
  this.update();
  return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
  this._div.innerHTML =
    "<h4>US Population Density</h4>" +
    (props
      ? "<b>" +
        props.name +
        "</b><br />" +
        props.density +
        " people / mi<sup>2</sup>"
      : "Hover over a state");
};

info.addTo(mymap);

$.getJSON(
  "https://raw.githubusercontent.com/inezabonte/flood-detection/main/RW_districts.geojson",
  function (data) {
    L.geoJSON(data, {
      onEachFeature: function (feature, layer) {
        $.getJSON("damages.json", (data) => {
          $.each(data, (key, object) => {
            if (object.District == feature.properties.NAME_2) {
              layer.bindPopup(
                `District:${object.District} <br> 
                Deaths:${object.Deaths} <br> 
                Injured:${object.Injured} <br>
                Houses Damaged:${object.Houses_Damaged} <br>
                Crops Hectares:${object.Crops_Ha} <br>
                Livestock:${object.Livestock}`
              );
            }
          });
        });
      },

      style: style,
    }).addTo(mymap);
  }
);
