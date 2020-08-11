const socketIo = require('socket.io');

module.exports = server => {
    const io = socketIo(server);

    io.on('connection', socket => {
        console.log(`Socket connection for ID ${socket.id} established!`);

        socket.on('disconnect', function () {
            console.log(`Socket connection for ID ${this.id} disconnected!`);
        });
    })
}