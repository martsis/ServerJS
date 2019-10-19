const framework = require('../framework');

class HomeController extends framework.Controller{
    constructor(...args){
        super(...args);
    }

    index(){
        const model = new framework.ModelView({
            name: 'index'
        });
        model.title = 'JsServer';

        this.render(model);
    }
}

exports.HomeController = HomeController;