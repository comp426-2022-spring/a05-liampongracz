const express = require('express');
const app = express();

const minimist = require('minimist')
const args = minimist(process.argv.slice(2))

const morgan = require('morgan')

const routes = require('./src/routes/someroutes.js');


const server = app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT",HTTP_PORT))
});

app.use(express.static('./public'))

app.use(express.json());

app.use('/app',routes);

process.on('SIGTERM', () => {
    server.close(() => {
        console.log("Server stopped");
    })
})