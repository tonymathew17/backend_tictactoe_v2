const express = require('express');
const http = require('http');
const app = express();

const server = http.createServer(app);
require('./server/socket')(server);

server.listen(3001, () => { 
    console.log('App is listening on port 3001');
})