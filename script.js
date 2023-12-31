// Variables to store the current player's symbol ("X" or "O") and game status
let currentPlayer = "";
let gameStarted = false;
let againstComputer = false;

// Get the buttons for selecting "X" or "O"
const selectXButton = document.getElementById('selectX');
const selectOButton = document.getElementById('selectO');

// Add click event listeners to the selection buttons
selectXButton.addEventListener('click', () => {
    currentPlayer = "X";
    gameStarted = true;
    // Hide the selection buttons
    document.querySelector('.selection').style.display = 'none';
    startGame();
});

selectOButton.addEventListener('click', () => {
    currentPlayer = "O";
    gameStarted = true;
    // Hide the selection buttons
    document.querySelector('.selection').style.display = 'none';
    startGame();
});

// Get all the box elements
const boxes = document.querySelectorAll('.box');

// Variable to keep track of the game state
let gameBoard = ["", "", "", "", "", "", "", "", ""];

// Function to check if there is a winner and return the winning combination
function checkWinner() {
    const winningCombination = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let combination of winningCombination) {
        const [a, b, c] = combination;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            return gameBoard[a]; // Return the winning player's symbol ('X' or 'O')
        }
    }

    if (!gameBoard.includes("")) {
        return 'tie'; // It's a tie if there are no empty boxes left
    }

    return null; // No winner yet
}

// Function to handle box click
function handleBoxClick(event) {
    const boxIndex = Array.from(boxes).indexOf(event.target);

    // Check if the box is empty and the game is not over
    if (gameBoard[boxIndex] === "" && gameStarted) {
        // Set the content of the clicked box to the current player's symbol ("X" or "O")
        event.target.textContent = currentPlayer;

        // Update the game state
        gameBoard[boxIndex] = currentPlayer;

        
        // Check if there is a winner after a move
        const winner = checkWinner();

        if (winner) {
            const winnerDisplay = document.querySelector('.winner-display');
            const winnerText = document.getElementById('winnerText');

            if (againstComputer) {
                if (winner === 'X') {
                    winnerText.textContent = 'Player wins!';
                } else {
                    winnerText.textContent = 'Computer wins!';
                }
            } else {
                winnerText.textContent = `Player ${winner} wins!`;
            }

            winnerDisplay.style.display = 'block';
            gameStarted = false;
            return;
        }

        // Check for a tie game
        if (!gameBoard.includes("")) {
            // Display the tie announcement
            const winnerDisplay = document.querySelector('.winner-display');
            const winnerText = document.getElementById('winnerText');
            winnerText.textContent = "It's a tie!";
            winnerDisplay.style.display = 'block';

            // Disable further moves
            gameStarted = false;
            return;
        }

        // Toggle the current player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

        // If playing against the computer, make the computer's move
        if (againstComputer && gameStarted) {
            makeComputerMove();
        }
    }
}

// Add a click event listener to each box
boxes.forEach(box => {
    box.addEventListener('click', handleBoxClick);
});

// Function to highlight the winning combination
function highlightWinningCombination(combination) {
    for (let index of combination) {
        boxes[index].classList.add('winning-box');
    }
}

// Function to start a new game
function startGame() {
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    boxes.forEach(box => {
        box.textContent = "";
        box.classList.remove('winning-box');
    });
    document.getElementById('winnerText').textContent = "";
    document.querySelector('.winner-display').style.display = 'none';

    // If playing against the computer and it's the computer's turn, make the computer's move
    if (againstComputer && currentPlayer === 'O') {
        makeComputerMove();
    }
}

// Function to reset the game
function resetGame() {
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "";
    boxes.forEach(box => {
        box.textContent = "";
        box.classList.remove('winning-box');
    });
    document.querySelector('.selection').style.display = 'block';
    document.querySelector('.winner-display').style.display = 'none';
    document.getElementById('playAgainstPlayer').style.display = 'none';
    document.getElementById('playAgainstComputer').style.display = 'none';

}

// Function to evaluate the minimax value for a given board state
function minimax(board, depth, isMaximizing) {
    const scores = {
        X: -1,
        O: 1,
        tie: 0
    };

    if (checkWinner() === 'X') {
        return scores.X - depth;
    } else if (checkWinner() === 'O') {
        return scores.O + depth;
    } else if (!gameBoard.includes("")) {
        return scores.tie;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = 'O';
                const score = minimax(board, depth + 1, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = 'X';
                const score = minimax(board, depth + 1, true);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Function to make the computer's move using the minimax algorithm
function makeComputerMove() {
    if (gameStarted && currentPlayer === 'O') {
        let bestScore = -Infinity;
        let move;

        for (let i = 0; i < 9; i++) {
            if (gameBoard[i] === "") {
                gameBoard[i] = 'O';
                const score = minimax(gameBoard, 0, false);
                gameBoard[i] = "";

                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }

        boxes[move].click();
    }
}

// // Function to make a random computer move

// function makeComputerMove() {

//     if (gameStarted && currentPlayer === 'O') {
//         // Find empty boxes
//         const emptyBoxes = gameBoard.reduce((acc, value, index) => {
//             if (value === "") {
//                 acc.push(index);
//             }
//             return acc;
//         }, []);

//         // Randomly select an empty box
//         const randomIndex = Math.floor(Math.random() * emptyBoxes.length);
//         const computerMoveIndex = emptyBoxes[randomIndex];

//         // Simulate a click on the selected box
//         boxes[computerMoveIndex].click();
//     }
// }

// Hide the "Restart Game" button initially
const restartGameButton = document.getElementById('restartGame');

// Event listener for the "Play Against Computer" button
document.getElementById('playAgainstComputer').addEventListener('click', () => {
    againstComputer = true;
    currentPlayer = "X"; // Human player starts
    document.getElementById('selectX').disabled = true;
    document.getElementById('selectO').disabled = true;

    // Hide other options
    document.getElementById('playAgainstPlayer').style.display = 'none';
    document.getElementById('playAgainstComputer').style.display = 'none';
    document.querySelector('.selection').style.display = 'none';

    // Show the "Restart Game" button
    restartGameButton.style.display = 'block';

    startGame();
});

// Event listener for the "Play Against Player" button
document.getElementById('playAgainstPlayer').addEventListener('click', () => {
    againstComputer = false;
    document.getElementById('selectX').disabled = false;
    document.getElementById('selectO').disabled = false;

    // Hide other options
    document.getElementById('playAgainstPlayer').style.display = 'none';
    document.getElementById('playAgainstComputer').style.display = 'none';
    document.querySelector('.selection').style.display = 'block';

    // Show the "Restart Game" button
    restartGameButton.style.display = 'block';

    startGame();
});

// Event listener for the "Restart Game" button
restartGameButton.addEventListener('click', () => {
    currentPlayer = "";
    gameStarted = true;
    resetGame();
    document.getElementById('winnerText').textContent = "";
    document.querySelector('.winner-display').style.display = 'none';

    // Displaying the various playing options
    document.getElementById('playAgainstPlayer').style.display = 'inline';
    document.getElementById('playAgainstComputer').style.display = 'inline';
    document.querySelector('.selection').style.display = 'block';



    // If playing against the computer and it's the computer's turn, make the computer's move
    if (againstComputer && currentPlayer === 'O') {
        makeComputerMove();
    }
});