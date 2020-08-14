const helper = require('../utils/helper');

const socketIo = require('socket.io');

let moves = ['X', 'O'];
let sockets = [];
let firstConnectionSocketId;
let secondConnectionSocketId;
let winningCombinations;
let boardSize;
let XMoves = [];
let OMoves = [];

module.exports = server => {
    const io = socketIo(server);

    io.on('connection', socket => {


        const socketId = socket.id;
        console.log(`Socket connection for ID ${socketId} established!`);

        sockets.push(socketId);

        if (sockets.length == 1) {
            socket.emit('errorJoining', 'Open one more session in another tab to start the game')
        }
        else if (sockets.length == 2) {
            const randomIndex = Math.round(Math.random());
            const move = moves[randomIndex];
            const opponentMove = move == 'X' ? 'O' : 'X';
            firstConnectionSocketId = sockets[0];
            io.to(firstConnectionSocketId).emit('move', { move: move, opponentMove: opponentMove });
            secondConnectionSocketId = sockets[1];
            io.to(secondConnectionSocketId).emit('move', { move: opponentMove, opponentMove: move });
        }
        else {
            socket.emit('errorJoining', 'Two sessions already active!');
            const socketIdIndex = sockets.indexOf(socketId);
            if (socketIdIndex > -1) sockets.splice(socketIdIndex, 1);
            socket.disconnect();
        }

        socket.on('boardSize', size => {
            if (!boardSize && !winningCombinations) {
                boardSize = size;
                winningCombinations = helper.winningCombinations(size);
            }
        });

        socket.on('cellClicked', (clickData) => {
            const cellId = clickData.cellId;
            const move = clickData.move;
            let moves = [];
            if (move === 'X') {
                XMoves.push(cellId);
                moves = XMoves;
            } else if (move === 'O') {
                OMoves.push(cellId);
                moves = OMoves;
            }
            console.log(`XMoves: ${XMoves}, OMoves: ${OMoves}`)

            const gameStatus = helper.checkWinner(moves, boardSize, winningCombinations);
            if (gameStatus) {
                socket.emit('gameResult', gameStatus.status);
                socket.broadcast.emit('gameResult', 'You Loose!');
            }
            else if (XMoves.length + OMoves.length === (boardSize * boardSize)) {
                socket.emit('gameResult', 'Tied!');
                socket.broadcast.emit('gameResult', 'Tied!');
            }
            else {
                socket.broadcast.emit('cellClicked', { cellId });
            }

        });

        socket.on('disconnect', function () {
            OMoves = [];
            XMoves = [];
            const socketId = this.id;
            console.log(`Socket connection for ID ${socketId} disconnected!`);
            const socketIdIndex = sockets.indexOf(socketId);
            if (socketIdIndex > -1) sockets.splice(socketIdIndex, 1);

            let opponentSocketId;
            if (socketId == firstConnectionSocketId) opponentSocketId = secondConnectionSocketId;
            if (socketId == secondConnectionSocketId) opponentSocketId = firstConnectionSocketId;

            if (opponentSocketId) io.to(opponentSocketId).emit('errorJoining', 'Other player disconnected');
        });
    })
}