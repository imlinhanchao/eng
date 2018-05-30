const req = require('../lib/req');
const App = require('./app');
const Words = require('./word');

let __error__ = Object.assign({}, App.error);
__error__.notexisted = App.error.existed('单词', false);
__error__.notexistedPage = App.error.existed('页码', false);
__error__.notexistedNum = App.error.existed('编号', false);

class Module extends App {
    constructor() {
        super([]);
    }

    get error() {
        return __error__;
    }
    
    async query(word) {
        word = word.toLowerCase();
        if (word.match(/^\d/)) {
            let data = word.split(',');
            if (data.length < 2)
                throw this.error.param;
            let page = data[0] - 38;
            if (page < 0 || page > 56)
                throw this.error.notexistedPage;
            let index = data[1] - 1;
            if (index < 0
                || index > (page > 1 ? 80 : 70))
                throw this.error.notexistedNum;

            index = page > 1 ? (page - 2) * 80 + 70 + index : index;
            return Words[index] ? this.okquery(Words[index]) : this.error.notexisted;
        } else {
            let index = -1;
            for (let i = 0; i < Words.length; i++) {
                let data = Words[i].toLowerCase().split('/');
                if (data[0].trim() == word) index = i;
                if (data[1]) {
                    if (data[1].charAt(0) == '-') {
                        data[1] = data[0].slice(0, 1 - data[1].length) + data[1].slice(1);
                    }
                    if (data[1].trim() == word) index = i;
                }
            }
            let dict = await this.dict(word);
            if (!dict.word) throw this.error.notexisted;
            dict.isSelf = index > 0;
            dict.index = index;
            return this.okquery(dict);
        }
    }

    input(word) {
        word = word.toLowerCase();        
        if (word.match(/\d/)) throw this.error.param;
        let tips = [];
        for (let i = 0; i < Words.length && tips.length < 5; i++) {
            if (Words[i].toLowerCase().match(new RegExp(`^${word}`))) {
                tips.push(Words[i]);
            }
        }
        if (tips.length < 1) {
            for (let i = 0; i < Words.length && tips.length < 5; i++) {
                if (Words[i].match(new RegExp(`${word}`))) {
                    tips.push(Words[i]);
                }
            }    
        }
        return this.okquery(tips);
    }

    async dict(word) {
        let rsp = await req.get(`http://xtk.azurewebsites.net/BingDictService.aspx?Word=${word}`);
        let data = JSON.parse(rsp.body);
        return data;
    }
}

module.exports = Module;