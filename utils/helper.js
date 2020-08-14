const winningCombinations = (boardSize) => {
    let availableCells = [];
    let winningCombinations = [];
    let row = [];

    // Populating available cells
    for (let i = 0; i < boardSize * boardSize; i++) {
        availableCells.push(i);
    }

    // Generating Winning combinations
    // Generating horizontal winning combinations
    let cellDuplicate = availableCells.slice();
    for (let i = 0; i < boardSize; i++) {
        let a = cellDuplicate.splice(boardSize);
        winningCombinations.push(cellDuplicate);
        cellDuplicate = a.slice();
    }

    // Generating Vertical winning combinations
    for (let j = 0; j < boardSize; j++) {
        row = [];
        for (let i = j; row.length < boardSize; i = i + boardSize) {
            row.push(i);
        }
        winningCombinations.push(row);
    }

    // Generating diagonal winning combinations
    row = [];
    for (let i = 0; row.length < boardSize; i = i + (boardSize + 1)) {
        row.push(i);
    }
    winningCombinations.push(row);

    row = [];
    for (let i = (boardSize - 1); row.length < boardSize; i = i + (boardSize - 1)) {
        row.push(i);
    }
    winningCombinations.push(row);

    return winningCombinations;
}

function checkWinner(moves, boardSize, winningCombinations) {
    // Finding winning combination
    if (moves.length >= boardSize) {
        let combination = winningCombinations.find(winningCombination =>
            winningCombination.every(elem =>
                moves.indexOf(elem) > -1)
        )
        if (combination) {
            return {
                status: 'You Won!',
                winningCombination: combination
            }
        }
    }

/*     // Check if game is tied
    if (availableCells.length == 0) {
        return {
            status: 'tie',
            winningCombination: []
        }
    } */
}

module.exports = {
    winningCombinations,
    checkWinner
}