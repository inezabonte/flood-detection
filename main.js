const mymap = L.map("mapid").setView([-1.9403, 29.8739], 9);

const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);

$.getJSON(
  "https://raw.githubusercontent.com/inezabonte/flood-detection/main/RW_districts.geojson",
  function (data) {
    L.geoJSON(data).addTo(mymap);
  }
);
