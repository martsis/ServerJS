// routing/index.js
const url = require('url');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const configuration = require('../configuration');
const framework = require('../framework');

const defineRoute = function(req, res, postData){
    // получаем адрес
    const urlParsed = url.parse(req.url, true);
    let filePath = urlParsed.pathname.slice(1);
    //filePath = filePath.slice(1);

    let controller = filePath.split('/')[0];
    let action = filePath.split('/')[1];
    let id = filePath.split('/')[2];

    if (typeof controller != 'string' || controller == ''){
        controller = configuration.homePage.controller;
    } else {
        controller = controller.toLowerCase();
    }

    if (typeof action != 'string' || action == ''){
        action = configuration.homePage.action;
    } else {
        action = action.toLowerCase();
    }

    if (typeof id == 'string' && id != ''){
        try {
            id = parseInt(id);
            
            if (!isFinite(id)){
                id = -1;
            }
        } catch (err) {
            console.log(err);
            id = -1;
        }
    } else {
        id = -1;
    }

    try {
        let dynPath = `../controller/${controller}Controller`;
        let routeDestination = require(dynPath);

        const controllerName = `${controller}Controller`.charAt(0).toUpperCase() + `${controller}Controller`.slice(1);
        const controllerConstructor = routeDestination[controllerName];
        const controllerImplemented = new controllerConstructor(req, res, postData);

        res.writeHead(res.statusCode, {'Content-Type': 'text/html'});

        try{
            if (id === -1){
                controllerImplemented[action]();
            } else {
                controllerImplemented[action](id);
            }
        } catch (err){
            const modelView = new framework.ModelView({
                name: '404'
            });
            modelView.error = err;
            modelView.title = 'Action not found';
            res.statusCode = 404;
            res.writeHead(res.statusCode, {'Content-Type': 'text/html'});

            ejs.renderFile(`${framework.params.fileRoot}${path.sep}view${path.sep}404.ejs`, modelView, (err, str) => {
                if (err){
                    res.end(`Error: ${err}`);
                } else {
                    res.end(str);
                }
            });
        }
    }
    catch (err){
        // страница не найдена
        const modelView = new framework.ModelView({
            name: '404'
        });
        modelView.error = err;
        modelView.title = 'Controller not found';
        res.statusCode = 404;
        res.writeHead(res.statusCode, {'Content-Type': 'text/html'});

        ejs.renderFile(`${framework.params.fileRoot}${path.sep}view${path.sep}404.ejs`, modelView, (err, str) => {
            if (err){
                res.end(`Error: ${err}`);
            } else {
                res.end(str);
            }
        });
    }
};

module.exports.defineRoute = defineRoute;