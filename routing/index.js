// routing/index.js
const url = require('url');
const fs = require('fs');

const define = function(req, res, postData){
    // получаем адрес
    const urlParsed = url.parse(req.url, true);
    let path = urlParsed.pathname.slice(1);
    //path = path.slice(1);

    let controller = path.split('/')[0];
    let action = path.split('/')[1];
    let id = path.split('/')[2];

    if (typeof controller != 'string' || controller == ''){
        controller = 'default';
    } else {
        controller = controller.toLowerCase();
    }

    if (typeof action != 'string' || action == ''){
        action = 'index';
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
        
        res.writeHead(200, {'Content-Type': 'text/html'});

        try{
            if (id === -1){
                controllerImplemented[action]();
            } else {
                controllerImplemented[action](id);
            }
        } catch (err){
            console.log(err);
            res.end(`Action not found: ${err}`);
        }


        // routeDestination.promise(res, postData, req).then(
        //     result => {
        //         res.writeHead(200);
        //         res.end(result);
        //     },
        //     resolve => {
        //         let endMessage = {};
        //         endMessage.error = 1;
        //         endMessage.errorName = resolve;
        //         res.end(JSON.stringify(endMessage));
        //         return;
        //     }
        // );
    }
    catch (err){
        // страница не найдена
        console.log(err);
        res.end(`API not found: ${err}`);
    }
};

exports.define = define;