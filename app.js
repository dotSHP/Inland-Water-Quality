// ----------------------
// TAB SWITCHING
// ----------------------
function showTab(tab) {
  document
    .querySelectorAll(".nav-tabs button")
    .forEach((btn) => btn.classList.remove("active"));

  if (tab === "map") {
    document.querySelectorAll(".nav-tabs button")[0].classList.add("active");

    document.getElementById("mapLayout").style.display = "flex";
    document.getElementById("metadataPage").style.display = "none";
  }

  if (tab === "metadata") {
    document.querySelectorAll(".nav-tabs button")[1].classList.add("active");

    document.getElementById("mapLayout").style.display = "none";
    document.getElementById("metadataPage").style.display = "block";
  }
}

// ----------------------
// STATIONS
// ----------------------
const stations = [
  {
    id: "station_1",
    name: "Station A",
    catchment: "Upper Vaal",
    lat: -33.92,
    lng: 18.42,
  },
  {
    id: "station_2",
    name: "Station B",
    catchment: "Orange River",
    lat: -33.88,
    lng: 18.55,
  },
];

const markerLayer = L.layerGroup().addTo(map);

function renderStations() {
  markerLayer.clearLayers();

  const selected = document.getElementById("catchmentFilter").value;

  stations.forEach((s) => {
    if (selected !== "all" && s.catchment !== selected) return;

    const marker = L.circleMarker([s.lat, s.lng], {
      radius: 8,
      color: "#17324d",
      fillColor: "#2b78c5",
      fillOpacity: 0.9,
    }).addTo(markerLayer);

    marker.on("click", () => selectStation(s));
  });
}

// ----------------------
// CHART
// ----------------------
const chart = echarts.init(document.getElementById("chart"));

const stationReadings = {
  station_1: [
    {
      date: "2026-01",
      "E.coli": 140,
      "E.coli (log)": 2.1,
      "Ortho-phosphate": 0.12,
      Nitrogen: 1.8,
      "Dissolved Oxygen": 7.5,
      "Un-ionised Ammonia": 0.03,
      pH: 7.1,
      Conductivity: 88,
      Chlorophyll: 12,
      Microcystin: 0.4,
    },
    {
      date: "2026-02",
      "E.coli": 170,
      "E.coli (log)": 2.3,
      "Ortho-phosphate": 0.14,
      Nitrogen: 2.0,
      "Dissolved Oxygen": 7.1,
      "Un-ionised Ammonia": 0.04,
      pH: 7.2,
      Conductivity: 90,
      Chlorophyll: 13,
      Microcystin: 0.5,
    },
    {
      date: "2026-03",
      "E.coli": 160,
      "E.coli (log)": 2.2,
      "Ortho-phosphate": 0.11,
      Nitrogen: 1.9,
      "Dissolved Oxygen": 7.4,
      "Un-ionised Ammonia": 0.03,
      pH: 7.0,
      Conductivity: 86,
      Chlorophyll: 11,
      Microcystin: 0.3,
    },
  ],
};

let currentStation = "station_1";

function selectStation(station) {
  currentStation = station.id;

  document.getElementById("stationName").innerText = station.name;
  document.getElementById("stationCatchment").innerText = station.catchment;

  updateChart();
}

function getParam() {
  return document.querySelector('input[name="parameter"]:checked').value;
}

function updateChart() {
  const p = getParam();
  const data = stationReadings[currentStation];

  chart.setOption({
    xAxis: { type: "category", data: data.map((d) => d.date) },
    yAxis: { type: "value" },
    series: [{ type: "line", data: data.map((d) => d[p]), smooth: true }],
  });
}

// ----------------------
// EVENTS
// ----------------------
document
  .getElementById("catchmentFilter")
  .addEventListener("change", renderStations);

document
  .querySelectorAll('input[name="parameter"]')
  .forEach((r) => r.addEventListener("change", updateChart));

// INIT
renderStations();
updateChart();
