const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const configuration = require('../configuration');

const params = {
    fileRoot: ''
};

class Controller{
    constructor(request, response, postData){
        this.request = request;
        this.response = response;
        this.postData = postData;
    }

    index(id){
        if (typeof id !== 'undefined'){
            this.model.id = id;
        }

        const modelView = new ModelView({
            name: 'index'
        });

        modelView.title = 'Default!';

        this.render(modelView);
    }

    render(modelView){
        try{
            // смотрим, есть ли такой файл
            let filePath = `${params.fileRoot}${path.sep}view${path.sep}${modelView.name.toLowerCase()}${path.sep}${modelView.name}.ejs`;
            
            fs.stat(filePath, (err, stat) => {
                if (err){
                    filePath = `${params.fileRoot}${path.sep}view${path.sep}${modelView.name}.ejs`;
                }

                ejs.renderFile(filePath, modelView, (err, str) => {
                    if (err){
                        this.response.statusCode = 200;
                        this.response.end(`<br>Error: ${err}<br>Path: ${filePath}`);
                    } else {
                        this.response.statusCode = 200;
                        this.response.end(str);
                    }
                });
            });

        } catch (err){
            console.log(err);
            this.response.end(`View not found: ${err}`);
        }
    }
}

class ModelView{
    constructor(option = {name: 'index', title}){
        this.name = option.name;
        this.title = option.title;
    }
}

exports.Controller = Controller;
exports.ModelView = ModelView;
exports.params = params;