const form = document.getElementById('player-form');
const successMessage = document.querySelector('.success-message');
const submissionMessage = document.querySelector('.submission-message');
const playerList = document.getElementById('player-list');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const shotToGoalRatio = parseFloat(document.getElementById('shot-to-goal-ratio').value);
  const goalContribution = parseFloat(document.getElementById('goal-contribution').value);
  const assists = parseFloat(document.getElementById('assists').value);
  const freeKicks = parseFloat(document.getElementById('free-kicks').value);

  const player = {
    name,
    current_season_stats: {
      shot_to_goal_ratio: shotToGoalRatio,
      goal_contribution_per_game: goalContribution,
      assists_per_game: assists,
      free_kicks_per_game: freeKicks
    }
  };

  const listItem = document.createElement('li');
  listItem.textContent = `Name: ${player.name}, Shot-to-Goal Ratio: ${player.current_season_stats.shot_to_goal_ratio}, Goal Contribution per game: ${player.current_season_stats.goal_contribution_per_game}, Assists per game: ${player.current_season_stats.assists_per_game}, Free Kicks per game: ${player.current_season_stats.free_kicks_per_game}`;
  playerList.appendChild(listItem);

  successMessage.style.display = 'block';
  setTimeout(() => {
    successMessage.style.display = 'none';
  }, 2000);
  submissionMessage.style.display = 'block';

  form.reset();
});