const menuToggle = document.getElementById("menuToggle");
const hamburgerDropdown = document.getElementById("hamburgerDropdown");

menuToggle.onclick = function () {
  hamburgerDropdown.classList.toggle("show");
};

document.addEventListener("DOMContentLoaded", function() {
  const playerNameElement = document.getElementById("playerName");
  const trophyContainer = document.querySelector(".stats-flex-container");

  const currentPlayerData = JSON.parse(sessionStorage.getItem('currentPlayer'));

  if (currentPlayerData) {
    playerNameElement.textContent = currentPlayerData.name;
    const trophyRecords = currentPlayerData.trophy_records;

    for (const [trophyType, count] of Object.entries(trophyRecords)) {
      if (count > 0) {
        const trophyDiv = document.createElement("div");
        trophyDiv.classList.add("trophy");

        const trophyImg = document.createElement("img");
        trophyImg.src = `images/${trophyType}.webp`;
        trophyImg.alt = trophyType;
        trophyDiv.appendChild(trophyImg);

        const trophyCaption = document.createElement("p");
        trophyCaption.classList.add("caption");
        trophyCaption.textContent = `${count} ${trophyType.replace('_', ' ').toUpperCase()}`;
        trophyDiv.appendChild(trophyCaption);

        trophyContainer.appendChild(trophyDiv);
      }
    }
  }
});
