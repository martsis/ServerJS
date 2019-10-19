const fs = require('fs');
const path = require('path');
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

        const modelView = new ModelView();

        modelView.title = 'Hello, World!';
        modelView.text = 'Welcome!';

        try{
            this.render(modelView);
            //this.response.end(`Default Controller;\n${this.model.id}`);
        } catch (err){
            console.log(err);
            this.response.end(`Render not found: ${err}`);
        }
    }

    render(modelView){
        try{
            // смотрим, есть ли такой файл
            const name = this.constructor.name.slice(0, this.constructor.name.indexOf('Controller'));
            let filePath = `${params.fileRoot}${path.sep}view${path.sep}${name.toLowerCase()}${path.sep}index.html`;
            
            fs.stat(filePath, (err, stat) => {
                if (err){
                    filePath = `${params.fileRoot}${path.sep}view${path.sep}default${path.sep}index.html`;
                }
                
                fs.readFile(filePath, "utf8", (error, data) => {
                    if(error){      
                        let text = '';
    
                        for (const key of Object.keys(modelView)){
                            text += `${modelView[key]}`;
                        }
    
                        this.response.statusCode = 200;
                        this.response.end(`Resourse not found!\nPath: ${filePath}`);
                    }   
                    else{
                        if (Object.keys(modelView).length > 0){
                            for (const key of Object.keys(modelView)){
                                while (data.indexOf(`{${key}}`) != -1){
                                    data = data.replace(`{${key}}`, modelView[key]);
                                }
                            }
                        }
    
                        this.response.statusCode = 200;
                        this.response.end(data);
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
    constructor(){
        this.title;
    }
}

exports.Controller = Controller;
exports.params = params;