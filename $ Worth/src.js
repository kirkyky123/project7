const menuToggle = document.getElementById("menuToggle");
const hamburgerDropdown = document.getElementById("hamburgerDropdown");

menuToggle.onclick = function () {
  hamburgerDropdown.classList.toggle("show");
};

const worth = [];
document.addEventListener("DOMContentLoaded", function () {
  const currentPlayerData = JSON.parse(sessionStorage.getItem("currentPlayer"));
  if (currentPlayerData) {
    const playerNameElement = document.getElementById("playerName");
    playerNameElement.textContent = currentPlayerData.name;
    worth.push(...currentPlayerData.worth.map((value) => value / 1000000));
  }
});

// placeholder data for now dw abtg this
google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawChart);
function drawChart() {
  let data = google.visualization.arrayToDataTable([
    ["Year", "$ Worth in millions", { role: "style" }],
    ["2014", worth[0], "#fa8072"],
    ["2016", worth[1], "#fa8072"],
    ["2018", worth[2], "#fa8072"],
    ["2020", worth[3], "#fa8072"],
    ["2022", worth[4], "#fa8072"],
    ["2024", worth[5], "#fa8072"],
  ]);

  let view = new google.visualization.DataView(data);
  view.setColumns([
    0,
    1,
    { calc: "stringify", sourceColumn: 1, type: "string", role: "annotation" },
    2,
  ]);

  let options = {
    width: 1000,
    height: 400,
    bar: { groupWidth: "95%" },
    legend: { position: "none" },
  };
  let chart = new google.visualization.ColumnChart(
    document.getElementById("columnchart_values")
  );
  chart.draw(view, options);
}
