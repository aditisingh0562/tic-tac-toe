const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const startGameBtn = document.getElementById("startGame");
const nextMatchBtn = document.getElementById("nextMatch");
const matchInfo = document.getElementById("matchInfo");
const finalWinnerDiv = document.getElementById("finalWinner");
const winnerText = document.getElementById("winnerText");
const scoreXText = document.getElementById("scoreX");
const scoreOText = document.getElementById("scoreO");
const playerXNameText = document.getElementById("playerXName");
const playerONameText = document.getElementById("playerOName");

let playerX, playerO, matchCount, currentMatch = 1;
let scores = { X: 0, O: 0 };
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],  
    [0, 3, 6], [1, 4, 7], [2, 5, 8],  
    [0, 4, 8], [2, 4, 6]             
];

// Start the Tournament
startGameBtn.addEventListener("click", () => {
    playerX = document.getElementById("playerX").value || "Player X";
    playerO = document.getElementById("playerO").value || "Player O";
    matchCount = parseInt(document.getElementById("matchCount").value) || 1;

    playerXNameText.textContent = playerX;
    playerONameText.textContent = playerO;

    document.getElementById("setup").style.display = "none";
    document.getElementById("gameContainer").style.display = "block";

    startMatch();
});

// Start a new match
function startMatch() {
    matchInfo.textContent = `Match ${currentMatch} of ${matchCount}`;
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    statusText.textContent = `${playerX}'s Turn (X)`;
    running = true;
    
    cells.forEach((cell, index) => {
        cell.textContent = "";
        cell.classList.remove("winner");
        cell.addEventListener("click", () => cellClick(index));
    });
}

// Handle Cell Clicks
function cellClick(index) {
    if (!running || board[index] !== "") return;

    board[index] = currentPlayer;
    cells[index].textContent = currentPlayer;
    
    checkWin();

    if (running) {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusText.textContent = currentPlayer === "X" ? `${playerX}'s Turn (X)` : `${playerO}'s Turn (O)`;
    }
}

// Check for a winner
function checkWin() {
    for (let pattern of winPatterns) {
        let [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            statusText.textContent = `🎉 ${currentPlayer === "X" ? playerX : playerO} Wins!`;
            running = false;
            scores[currentPlayer]++;
            updateScoreboard();
            nextMatchBtn.style.display = currentMatch < matchCount ? "block" : "none";
            
            if (currentMatch === matchCount) {
                setTimeout(showFinalWinner, 1000);
            }
            return;
        }
    }

    if (!board.includes("")) {
        statusText.textContent = "It's a Draw! 🤝";
        nextMatchBtn.style.display = currentMatch < matchCount ? "block" : "none";
        running = false;

        if (currentMatch === matchCount) {
            setTimeout(showFinalWinner, 1000);
        }
    }
}

// Update Scoreboard
function updateScoreboard() {
    scoreXText.textContent = scores.X;
    scoreOText.textContent = scores.O;
}

// Next Match
nextMatchBtn.addEventListener("click", () => {
    currentMatch++;
    nextMatchBtn.style.display = "none";
    startMatch();
});

// Show Final Winner
function showFinalWinner() {
    document.getElementById("gameContainer").style.display = "none";
    finalWinnerDiv.style.display = "block";

    let finalWinner;
    if (scores.X > scores.O) {
        finalWinner = playerX;
    } else if (scores.O > scores.X) {
        finalWinner = playerO;
    } else {
        finalWinner = "It's a Tie! 🤝";
    }

    winnerText.textContent = `🏆 ${finalWinner} is the Final Champion! 🎉`;

    // 🎊 Start Confetti Animation
    startConfetti();
}

// Confetti Effect
function startConfetti() {
    const confettiSettings = { target: "confetti-canvas" };
    const confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();
}
