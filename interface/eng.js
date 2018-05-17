//const req = require('../lib/req');
const App = require('./app');

let __error__ = Object.assign({}, App.error);
__error__.notexisted = App.error.existed('单词');

class Module extends App {
    constructor() {
        super([]);
    }

    get error() {
        return __error__;
    }
    
}

module.exports = Module;