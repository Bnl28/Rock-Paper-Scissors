const CHOICES = ["rock", "paper", "scissors"];
const EMOJI = { rock: "✊", paper: "✋", scissors: "✌️" };

// beats[a] = b means "a" beats "b"
const BEATS = { rock: "scissors", paper: "rock", scissors: "paper" };

const playerScoreEl = document.getElementById("player-score");
const cpuScoreEl = document.getElementById("cpu-score");
const messageEl = document.getElementById("message");
const roundResultEl = document.getElementById("round-result");
const playerPickEl = document.getElementById("player-pick");
const cpuPickEl = document.getElementById("cpu-pick");
const resetBtn = document.getElementById("reset");

let playerScore = 0;
let cpuScore = 0;

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
}

document.querySelectorAll(".choice").forEach((button) => {
  button.addEventListener("click", () => {
    playRound(button.dataset.choice);
  });
});

resetBtn.addEventListener("click", () => {
  playerScore = 0;
  cpuScore = 0;
  updateScoreboard();
  messageEl.textContent = "Make your move!";
  messageEl.classList.remove("win", "lose", "draw");
  roundResultEl.hidden = true;
});
