document.addEventListener('DOMContentLoaded', () => {
    const playerModeSelect = document.getElementById('playerMode');
    const player2Options = document.getElementById('player2Options');
    const startGameButton = document.getElementById('startGameButton');
    const gameBoard = document.getElementById('gameBoard');
    const setupSection = document.getElementById('setup');
    const cells = document.querySelectorAll('.cell');
    const resetGameButton = document.getElementById('resetGameButton');
    const backMenuButton = document.getElementById('backMenuButton');
    const player1ScoreElement = document.querySelector('#player1Score span');
    const player2ScoreElement = document.querySelector('#player2Score span');

    let isXTurn = true;
    let board = Array(9).fill(null);
    let player1Score = 0;
    let player2Score = 0;

    playerModeSelect.addEventListener('change', () => {
        if (playerModeSelect.value === '1') {
            player2Options.style.display = 'none';
        } else {
            player2Options.style.display = 'block';
        }
    });

    startGameButton.addEventListener('click', () => {
        setupSection.style.display = 'none';
        gameBoard.style.display = 'block';
        resetGame();
    });

    cells.forEach(cell => {
        cell.addEventListener('click', () => handleCellClick(cell));
    });

    resetGameButton.addEventListener('click', resetGame);

    backMenuButton.addEventListener('click', () => {
        setupSection.style.display = 'block';
        gameBoard.style.display = 'none';
        resetGame();
        player1Score = 0;
        player2Score = 0;
        player1ScoreElement.textContent = player1Score;
        player2ScoreElement.textContent = player2Score;
    });

    function handleCellClick(cell) {
        const index = cell.dataset.index;
        if (board[index] || checkWinner()) {
            return;
        }
        // Movimiento del jugador humano
        board[index] = isXTurn ? 'X' : 'O';
        cell.textContent = board[index];
        cell.style.color = isXTurn ? document.getElementById('player1Color').value : document.getElementById('player2Color').value;
        if (checkWinner()) {
            if (isXTurn) {
                player1Score++;
                player1ScoreElement.textContent = player1Score;
            } else {
                player2Score++;
                player2ScoreElement.textContent = player2Score;
            }
            alert(`¡${board[index]} ha ganado!`);
        } else if (board.every(cell => cell)) {
            alert('¡Empate!');
        }
        isXTurn = !isXTurn;

        // Movimiento de la computadora si es un jugador contra la máquina
        if (playerModeSelect.value === '1' && !checkWinner()) {
            setTimeout(computerMove, 500);
        }
    }

    function computerMove() {
        // Filtrar las casillas vacías
        const emptyCells = [];
        board.forEach((cell, index) => {
            if (!cell) {
                emptyCells.push(index);
            }
        });
        // Elegir una casilla vacía al azar
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const computerIndex = emptyCells[randomIndex];
        // Realizar el movimiento de la computadora
        board[computerIndex] = isXTurn ? 'X' : 'O';
        document.querySelector(`.cell[data-index="${computerIndex}"]`).textContent = board[computerIndex];
        document.querySelector(`.cell[data-index="${computerIndex}"]`).style.color = isXTurn ? document.getElementById('player1Color').value : document.getElementById('player2Color').value;
        if (checkWinner()) {
            if (!isXTurn) {
                player1Score++;
                player1ScoreElement.textContent = player1Score;
            } else {
                player2Score++;
                player2ScoreElement.textContent = player2Score;
            }
            alert(`¡${board[computerIndex]} ha ganado!`);
        } else if (board.every(cell => cell)) {
            alert('¡Empate!');
        }
        isXTurn = !isXTurn;
    }

    function checkWinner() {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        return winningCombinations.some(combination => {
            const [a, b, c] = combination;
            return board[a] && board[a] === board[b] && board[a]=== board[c];
        });
    }

    function resetGame() {
        board.fill(null);
        cells.forEach(cell => {
            cell.textContent = '';
            cell.style.color = '#000';
        });
        isXTurn = true;
    }
});