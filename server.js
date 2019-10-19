// server.js
const http = require('http');
const routing = require('./routing');
const framework = require('./framework');

const hostname = 'localhost';
const port = 3000;

const server = new http.Server(function(req, res){
    framework.params.fileRoot = __dirname;
    // API JSON
    // Всю информацию получаем в JSON
    let jsonString = '';
    res.setHeader('Content-Type', 'application/json');
    req.on('data', data => {
        jsonString += data;
    });

    // информации больше нет. передаем дальше
    req.on('end', () => {
        routing.defineRoute(req, res, jsonString);
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});