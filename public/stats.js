document.addEventListener("DOMContentLoaded", function () {
  const dropdown = document.getElementById("playerDropdown");

  fetch("api/players")
    .then((response) => response.json())
    .then((players) => {
      if (!players || players.length === 0) {
        console.error("No players found");
        return;
      }

      players.forEach((player) => {
        const option = document.createElement("option");
        option.value = player._id;
        option.textContent = player.name;
        dropdown.appendChild(option);
      });

      dropdown.onchange = function () {
        const playerId = this.value;
        if (playerId) {
          window.location.href = `stats.html?player=${playerId}`;
        }
      };
    })
    .catch((error) => {
      console.error("Error loading players:", error);
    });
});

function showStat(stat) {
  const sections = document.querySelectorAll(".stats-section");
  sections.forEach((section) => (section.style.display = "none"));
  document.getElementById(stat).style.display = "block";
}

document.addEventListener("DOMContentLoaded", function () {
  loadPlayerData();
});

function loadPlayerData() {
  const urlParams = new URLSearchParams(window.location.search);
  const playerId = urlParams.get("player");

  if (!playerId) {
    console.error("No player ID found");
    return;
  }

  fetch(`api/players/${playerId}`)
    .then((response) => response.json())
    .then((playerData) => {
      document.getElementById("playerName").textContent = playerData.name;
      const worth = playerData.worth.map((value) => value / 1000000);

      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(() => drawChart(worth));
      document.getElementById("playerName").textContent = playerData.name;
      populateStats(playerData);
    })
    .catch((error) => console.error("Failed to load player data:", error));
}

document.addEventListener("DOMContentLoaded", loadPlayerData);

function populateStats(player) {
  const allTimeStats = player.all_time_stats;
  document.getElementById("shotToGoalRatio").textContent =
    allTimeStats.shot_to_goal_ratio;
  document.getElementById("goalContributionPerGame").textContent =
    allTimeStats.goal_contribution_per_game;
  document.getElementById("assistsPerGame").textContent =
    allTimeStats.assists_per_game;
  document.getElementById("freeKicksPerGame").textContent =
    allTimeStats.free_kicks_per_game;

  const currentSeasonStats = player.current_season_stats;
  document.getElementById("currentShotToGoalRatio").textContent =
    currentSeasonStats.shot_to_goal_ratio;
  document.getElementById("currentGoalContributionPerGame").textContent =
    currentSeasonStats.goal_contribution_per_game;
  document.getElementById("currentAssistsPerGame").textContent =
    currentSeasonStats.assists_per_game;
  document.getElementById("currentFreeKicksPerGame").textContent =
    currentSeasonStats.free_kicks_per_game;

  const matchHistoryTable = document.getElementById("matchHistoryTable");
  matchHistoryTable.innerHTML = "";
  player.match_history.forEach((match) => {
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

  const trophyContainer = document.querySelector(
    ".trophy-stats-flex-container"
  );
  trophyContainer.innerHTML = "";

  const trophyRecords = player.trophy_records;
  for (const [trophyType, count] of Object.entries(trophyRecords)) {
    if (count > 0) {
      const trophyDiv = document.createElement("div");
      trophyDiv.classList.add("trophy");

      const trophyImg = document.createElement("img");
      trophyImg.src = `images/${trophyType}.webp`;
      trophyImg.alt = trophyType;
      trophyImg.classList.add("trophy-image");
      trophyDiv.appendChild(trophyImg);

      const trophyCaption = document.createElement("p");
      trophyCaption.classList.add("caption");
      trophyCaption.textContent = `${count} ${trophyType
        .replace("_", " ")
        .toUpperCase()}`;
      trophyDiv.appendChild(trophyCaption);

      trophyContainer.appendChild(trophyDiv);
    }
  }
}

function deleteCurrentPlayer() {
  const urlParams = new URLSearchParams(window.location.search);
  const playerId = urlParams.get("player");
  const playerName = document.getElementById("playerName").textContent;

  if (!playerId) {
    console.error("No player ID found");
    return;
  }

  if (playerId != "6626ea2cd9f18ef506d3e598"){
    Swal.fire({
      title: "Delete Player",
      text: "Are you sure you want to delete " + playerName + "?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete!",
      customClass: {
        popup: "delete-popup",
        title: "delete-title",
        content: "delete-content",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(playerId);
        deletePlayer(playerId);
      }
    });
  }
  else{
    Swal.fire({
      title: "Error",
      text: "You are not allowed to delete " + playerName + "! (try another account)", // for testing purposes
      icon: "warning",
      confirmButtonColor: "#d33",
      confirmButtonText: "Okay!",
      customClass: {
        popup: "delete-popup",
        title: "delete-title",
        content: "delete-content",
      },
    })
  }
}

async function deletePlayer(playerId) {
  try {
    const response = await fetch(`/api/players/${playerId}`, {
      method: "DELETE",
    });

    const playerName = document.getElementById("playerName").textContent;
    if (response.ok) {
      Swal.fire({
        title: "Deleted!",
        text: playerName + " has been deleted.",
        icon: "success",
        customClass: {
          popup: "delete-popup",
          title: "delete-title",
          content: "delete-content",
        },
      }).then(() => {
        window.location.href = "/";
      });
    } else {
      console.error("Failed to delete player");
    }
  } catch (error) {
    console.error("Error deleting player:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const playerData = urlParams.get("player");
  document.getElementById("playerName").textContent = playerData.name;
  // const worth = playerData.worth.map((value) => value / 1000000);

  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(() => drawChart(worth));
});

function drawChart(worth) {
  let data = google.visualization.arrayToDataTable([
    ["Year", "$ Worth in millions", { role: "style" }],
    ["2014", worth[0] || 0, "#fa8072"],
    ["2016", worth[1] || 0, "#fa8072"],
    ["2018", worth[2] || 0, "#fa8072"],
    ["2020", worth[3] || 0, "#fa8072"],
    ["2022", worth[4] || 0, "#fa8072"],
    ["2024", worth[5] || 0, "#fa8072"],
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

document.addEventListener("DOMContentLoaded", loadPlayerData);

const menuToggle = document.getElementById("menuToggle");
const hamburgerDropdown = document.getElementById("hamburgerDropdown");

menuToggle.onclick = function () {
  hamburgerDropdown.classList.toggle("show");
};

function showContent(contentId) {
  const sections = document.querySelectorAll(
    ".stats-image, .content-section, .navbar, .hideHamburger, .homePage"
  );
  sections.forEach((section) => section.classList.add("hidden"));

  const chartSection = document.getElementById("columnchart_values");
  if (chartSection) {
    chartSection.classList.add("hidden");
  }

  const targetSection = document.getElementById(contentId);
  if (targetSection) {
    targetSection.classList.remove("hidden");
  }

  hamburgerDropdown.classList.toggle("hide");
}

function mainMenu() {
  window.location.href = "/";
}

function submitForm(event) {
  event.preventDefault();

  const form = document.getElementById('form');
  const formData = new FormData(form);

  fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
  })
  .then(response => {
      if (response.ok) {
          console.log('Form submitted successfully');
          form.reset();
      } else {
          console.error('Form submission failed');
      }
  })
  .catch(error => {
      console.error('Error:', error);
  });
  const successMessage = document.querySelector('.inquirySuccess');
  successMessage.style.display = "block";
  setTimeout(() => {
    successMessage.style.display = "none";
  }, 2000);
}

function showHome() {
  const contentSections = document.querySelectorAll(".content-section");
  contentSections.forEach((section) => section.classList.add("hidden"));

  const statsSections = document.querySelectorAll(
    ".stats-image, .navbar, .hideHamburger, .homePage"
  );
  statsSections.forEach((section) => section.classList.remove("hidden"));

  hamburgerDropdown.classList.toggle("show");
}

document.addEventListener("DOMContentLoaded", function () {
  const playerForm = document.getElementById("player-form");
  const successMessage = document.querySelector(".success-message");
  const submissionMessage = document.querySelector(".submission-message");
  const playerList = document.getElementById("player-list");

  playerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("player-name").value;
    const currentSeasonStats = {
      shot_to_goal_ratio: parseFloat(
        document.getElementById("shot-to-goal-ratio").value
      ),
      goal_contribution_per_game: parseFloat(
        document.getElementById("goal-contribution").value
      ),
      assists_per_game: parseFloat(document.getElementById("assists").value),
      free_kicks_per_game: parseFloat(
        document.getElementById("free-kicks").value
      ),
    };
    const allTimeStats = {
      shot_to_goal_ratio: parseFloat(
        document.getElementById("all-time-shot-to-goal-ratio").value
      ),
      goal_contribution_per_game: parseFloat(
        document.getElementById("all-time-goal-contribution").value
      ),
      assists_per_game: parseFloat(
        document.getElementById("all-time-assists").value
      ),
      free_kicks_per_game: parseFloat(
        document.getElementById("all-time-free-kicks").value
      ),
    };
    const trophyRecords = {
      champions_league: parseInt(
        document.getElementById("champions-league").value
      ),
      league_title: parseInt(document.getElementById("league-title").value),
      world_cup: parseInt(document.getElementById("world-cup").value),
    };
    const matchHistory = [];
    for (let i = 1; i <= 6; i++) {
      const team = document.getElementById(`match${i}-team`).value;
      const score = document.getElementById(`match${i}-score`).value;
      const opponent = document.getElementById(`match${i}-opponent`).value;
      const opponentScore = document.getElementById(
        `match${i}-opponent-score`
      ).value;
      matchHistory.push({
        team,
        opponent,
        score: `${score}-${opponentScore}`,
      });
    }
    const worth = [
      parseInt(document.getElementById("worth-2014").value * 1000000),
      parseInt(document.getElementById("worth-2016").value * 1000000),
      parseInt(document.getElementById("worth-2018").value * 1000000),
      parseInt(document.getElementById("worth-2020").value * 1000000),
      parseInt(document.getElementById("worth-2022").value * 1000000),
      parseInt(document.getElementById("worth-2024").value * 1000000),
    ];

    const player = {
      name,
      current_season_stats: currentSeasonStats,
      all_time_stats: allTimeStats,
      trophy_records: trophyRecords,
      match_history: matchHistory,
      worth,
    };

    try {
      const response = await fetch("/api/players", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(player),
      });

      if (response.ok) {
        console.log("Player data sent successfully");
        const listItem = document.createElement("li");
        listItem.textContent = JSON.stringify(player, null, 2);
        playerList.appendChild(listItem);
        successMessage.style.display = "block";
        submissionMessage.style.display = "block";
        setTimeout(() => {
          successMessage.style.display = "none";
          submissionMessage.style.display = "none";
        }, 2000);
      } else {
        console.error("Error sending player data:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }

    playerForm.reset();
  });
});
