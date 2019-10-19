const framework = require('../framework');

class DefaultController extends framework.Controller{
    constructor(...args){
        super(...args);
    }
}

exports.DefaultController = DefaultController;