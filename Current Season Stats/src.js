const menuToggle = document.getElementById("menuToggle");
const hamburgerDropdown = document.getElementById("hamburgerDropdown");

menuToggle.onclick = function () {
  hamburgerDropdown.classList.toggle("show");
};

document.addEventListener("DOMContentLoaded", function() {
  const playerNameElement = document.getElementById("playerName");
  const shotToGoalRatioElement = document.getElementById("shotToGoalRatio");
  const goalContributionPerGameElement = document.getElementById("goalContributionPerGame");
  const assistsPerGameElement = document.getElementById("assistsPerGame");
  const freeKicksPerGameElement = document.getElementById("freeKicksPerGame");

  const currentPlayerData = JSON.parse(sessionStorage.getItem('currentPlayer'));

  if (currentPlayerData) {
    playerNameElement.textContent = currentPlayerData.name;
    shotToGoalRatioElement.textContent = currentPlayerData.current_season_stats.shot_to_goal_ratio;
    goalContributionPerGameElement.textContent = currentPlayerData.current_season_stats.goal_contribution_per_game;
    assistsPerGameElement.textContent = currentPlayerData.current_season_stats.assists_per_game;
    freeKicksPerGameElement.textContent = currentPlayerData.current_season_stats.free_kicks_per_game;
  }
});

