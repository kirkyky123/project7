const menuToggle = document.getElementById("menuToggle");
const hamburgerDropdown = document.getElementById("hamburgerDropdown");

menuToggle.onclick = function () {
  hamburgerDropdown.classList.toggle("show");
};

document.addEventListener("DOMContentLoaded", function() {
  const playerNameElement = document.getElementById("playerName");
  const matchHistoryTable = document.getElementById("matchHistoryTable");

  const currentPlayerData = JSON.parse(sessionStorage.getItem('currentPlayer'));

  if (currentPlayerData) {
    playerNameElement.textContent = currentPlayerData.name;
    if (currentPlayerData.match_history) {
      currentPlayerData.match_history.forEach(match => {
        const matchRow = document.createElement("div");
        matchRow.classList.add("match-row");
        
        const teamOpponent = document.createElement("span");
        teamOpponent.textContent = `${match.team} vs ${match.opponent}`;
        teamOpponent.classList.add("team-opponent");
        
        const score = document.createElement("span");
        score.textContent = match.score;
        score.classList.add("score");
        
        matchRow.appendChild(teamOpponent);
        matchRow.appendChild(score);
        
        matchHistoryTable.appendChild(matchRow);
      });
    } else {
      const noMatchHistory = document.createElement("div");
      noMatchHistory.textContent = "No match history.";
      matchHistoryTable.appendChild(noMatchHistory);
    }
  }
});
