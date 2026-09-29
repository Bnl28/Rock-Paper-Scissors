const CHOICES = ["rock", "paper", "scissors"];
const EMOJI = { rock: "✊", paper: "✋", scissors: "✌️" };
const KEY_MAP = { r: "rock", p: "paper", s: "scissors" };
const HISTORY_LIMIT = 5;
const STORAGE_KEY = "rps-scores";

// beats[a] = b means "a" beats "b"
const BEATS = { rock: "scissors", paper: "rock", scissors: "paper" };

const playerScoreEl = document.getElementById("player-score");
const cpuScoreEl = document.getElementById("cpu-score");
const messageEl = document.getElementById("message");
const roundResultEl = document.getElementById("round-result");
const playerPickEl = document.getElementById("player-pick");
const cpuPickEl = document.getElementById("cpu-pick");
const resetBtn = document.getElementById("reset");
const streakEl = document.getElementById("streak");
const historyListEl = document.getElementById("history-list");

let playerScore = 0;
let cpuScore = 0;
let winStreak = 0;
const history = [];

function loadScores() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && typeof saved.playerScore === "number" && typeof saved.cpuScore === "number") {
      playerScore = saved.playerScore;
      cpuScore = saved.cpuScore;
    }
  } catch (err) {
    // Ignore corrupted storage and start fresh.
  }
}

function saveScores() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ playerScore, cpuScore }));
}

function getCpuChoice() {
  const index = Math.floor(Math.random() * CHOICES.length);
  return CHOICES[index];
}

function decideWinner(player, cpu) {
  if (player === cpu) return "draw";
  return BEATS[player] === cpu ? "win" : "lose";
}

function updateScoreboard() {
  playerScoreEl.textContent = playerScore;
  cpuScoreEl.textContent = cpuScore;
}

function updateStreak(outcome) {
  if (outcome === "win") {
    winStreak += 1;
  } else {
    winStreak = 0;
  }

  if (winStreak >= 2) {
    streakEl.hidden = false;
    streakEl.textContent = `🔥 ${winStreak} win streak!`;
  } else {
    streakEl.hidden = true;
  }
}

function outcomeLabel(outcome) {
  if (outcome === "win") return "Won";
  if (outcome === "lose") return "Lost";
  return "Draw";
}

function addToHistory(playerChoice, cpuChoice, outcome) {
  history.unshift({ playerChoice, cpuChoice, outcome });
  history.length = Math.min(history.length, HISTORY_LIMIT);

  historyListEl.innerHTML = "";
  history.forEach((round) => {
    const item = document.createElement("li");
    item.className = `history-item ${round.outcome}`;
    item.textContent = `${EMOJI[round.playerChoice]} vs ${EMOJI[round.cpuChoice]} — ${outcomeLabel(round.outcome)}`;
    historyListEl.appendChild(item);
  });
}

function playRound(playerChoice) {
  const cpuChoice = getCpuChoice();
  const outcome = decideWinner(playerChoice, cpuChoice);

  playerPickEl.textContent = EMOJI[playerChoice];
  cpuPickEl.textContent = EMOJI[cpuChoice];
  roundResultEl.hidden = false;

  messageEl.classList.remove("win", "lose", "draw");

  if (outcome === "win") {
    playerScore += 1;
    messageEl.textContent = "You win this round!";
    messageEl.classList.add("win");
  } else if (outcome === "lose") {
    cpuScore += 1;
    messageEl.textContent = "Computer wins this round!";
    messageEl.classList.add("lose");
  } else {
    messageEl.textContent = "It's a draw!";
    messageEl.classList.add("draw");
  }

  updateScoreboard();
  updateStreak(outcome);
  addToHistory(playerChoice, cpuChoice, outcome);
  saveScores();
}

function resetGame() {
  playerScore = 0;
  cpuScore = 0;
  winStreak = 0;
  history.length = 0;

  updateScoreboard();
  saveScores();

  messageEl.textContent = "Make your move!";
  messageEl.classList.remove("win", "lose", "draw");
  roundResultEl.hidden = true;
  streakEl.hidden = true;
  historyListEl.innerHTML = "";
}

document.querySelectorAll(".choice").forEach((button) => {
  button.addEventListener("click", () => {
    playRound(button.dataset.choice);
  });
});

document.addEventListener("keydown", (event) => {
  const choice = KEY_MAP[event.key.toLowerCase()];
  if (choice) {
    playRound(choice);
  }
});

resetBtn.addEventListener("click", resetGame);

loadScores();
updateScoreboard();
