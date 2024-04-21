document.addEventListener("DOMContentLoaded", function() {
  const playerDropdown = document.getElementById("playerDropdown");
  const currentPlayerData = sessionStorage.getItem('currentPlayer');

  if (currentPlayerData) {
    const currentPlayer = JSON.parse(currentPlayerData);
    populateDropdown(currentPlayer.name);
  } else {
    fetch("players.json")
      .then(response => response.json())
      .then(data => {
        data.players.forEach(player => {
          const option = document.createElement("option");
          option.value = player.name;
          option.textContent = player.name;
          playerDropdown.appendChild(option);
        });
      });
  }

  playerDropdown.addEventListener("change", function() {
    const selectedPlayer = this.value;
    if (selectedPlayer) {
      fetch("players.json")
        .then(response => response.json())
        .then(data => {
          const selectedPlayerData = data.players.find(player => player.name === selectedPlayer);
          if (selectedPlayerData) {
            sessionStorage.setItem('currentPlayer', JSON.stringify(selectedPlayerData));
            window.location.href = 'home/home.html';
          }
        });
    }
  });

  function populateDropdown(selectedPlayerName) {
    const playerDropdown = document.getElementById("playerDropdown");
    fetch("players.json")
      .then(response => response.json())
      .then(data => {
        data.players.forEach(player => {
          const option = document.createElement("option");
          option.value = player.name;
          option.textContent = player.name;
          if (player.name === selectedPlayerName) {
            option.selected = true;
          }
          playerDropdown.appendChild(option);
        });
      });
  }
});
