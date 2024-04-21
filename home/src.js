const menuToggle = document.getElementById("menuToggle");
const hamburgerDropdown = document.getElementById("hamburgerDropdown");

menuToggle.onclick = function () {
  hamburgerDropdown.classList.toggle("show");
};

document.addEventListener("DOMContentLoaded", function () {
  const playerNameElement = document.getElementById("playerName");
  const currentPlayerData = JSON.parse(sessionStorage.getItem("currentPlayer"));

  if (currentPlayerData) {
    playerNameElement.textContent = currentPlayerData.name;
  }
});
