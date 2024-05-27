const req = require('../lib/req');
const App = require('./app');
const { JSDOM } = require('jsdom');

let __error__ = Object.assign({}, App.error);
__error__.notexisted = App.error.existed('单词', false);

class Module extends App {
    constructor() {
        super([]);
    }

    get error() {
        return __error__;
    }

    static async get(word, onlyData=false) {
        let rsp = await req.get(`https://cn.bing.com/dict/search?q=${word}`, {
            headers: {
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6'
            },
            cookie: 'ENSEARCH=BENVER=1;'
        });
        if (!rsp) return null;
        let window = new JSDOM(rsp.body).window;
        let document = window.document;

        let result = { word, spells: [], sams: [], defs: [] };

        if (!document.getElementById('headword')) throw this.error.notexisted;

        // Get Pronunciation
        let spells = document.getElementsByClassName('hd_p1_1')[0];
        let spellMp3 = spells && spells.getElementsByClassName('hd_tf');
        spells = spells.getElementsByClassName('b_primtxt');
        for (let i = 0; i < spells.length; i++) {
            let spell = {};
            spell.type = spells[i].textContent.split('[')[0].trim();
            let pronunciation = spells[i].textContent.match(/\[([^\]]*?)\]/);
            spell.pronunciation = pronunciation && pronunciation[1];
            let mp3 = spellMp3[i].innerHTML.match(/this,'([^']*?)',/);
            spell.mp3Url = mp3 && mp3[1];
            result.spells.push(spell);
        }

        let defs = document.getElementsByClassName('qdef')[0];
        defs = defs && defs.getElementsByTagName('li');
        for (let i = 0; defs && i < defs.length; i++) {
            let def = {};
            let pos = defs[i].getElementsByClassName('pos')[0];
            def.pos = pos && pos.textContent.trim();
            let mean = defs[i].getElementsByClassName('def')[0];
            def.def = mean && mean.textContent.trim();
            result.defs.push(def);
        }

        let sams = document.getElementsByClassName('se_li');
        for (let i = 0; i < sams.length; i++) {
            let sam = {};
            let eng = sams[i].getElementsByClassName('sen_en')[0];
            sam.eng = eng && eng.textContent;
            let chn = sams[i].getElementsByClassName('sen_cn')[0];
            sam.chn = chn && chn.textContent;
            let ime = sams[i].getElementsByClassName('sen_ime')[0];
            sam.ime = ime && ime.textContent;
            let from = sams[i].getElementsByClassName('sen_li')[0];
            from = from && from.getElementsByTagName('a')[0];
            sam.from = from && { href: from.href, src: from.textContent };
            let mp3 = sams[i].getElementsByClassName('gl_fl')[0];
            mp3 = mp3 && mp3.innerHTML.match(/this,'([^']*?)',/);
            sam.mp3Url = mp3 && mp3[1];
            result.sams.push(sam);
        }

        if(onlyData) return result;
        return App.ok('查询成功', result, true);
    }

    static async sen(data, onlyData=false) {
        if (!App.haskeys(data, ['word', 'offset'])) {
            throw (App.error.param);
        }

        let rsp = await req.get(`https://cn.bing.com/dict/service?q=${data.word}&offset=${data.offset}&dtype=sen`, {
            cookie: 'ENSEARCH=BENVER=1;'
        });
        if (!rsp) return null;
        let window = new JSDOM(rsp.body).window;
        let document = window.document;

        let result = [];
        let sams = document.getElementsByClassName('se_li');
        for (let i = 0; i < sams.length; i++) {
            let sam = {};
            let eng = sams[i].getElementsByClassName('sen_en');
            sam.eng = eng && eng[0].textContent;
            let chn = sams[i].getElementsByClassName('sen_cn');
            sam.chn = chn && chn[0].textContent;
            let ime = sams[i].getElementsByClassName('sen_ime');
            sam.ime = ime && ime[0].textContent;
            let from = sams[i].getElementsByClassName('sen_li');
            from = from && from.getElementsByTagName('a');
            sam.from = from && { href: from[0].href, src: from[0].textContent };
            let mp3 = sams[i].getElementsByClassName('mm_div');
            mp3 = mp3 && mp3.innerHTML.match(/this,'([^']*?)',/);
            sam.mp3Url = mp3 && mp3[1];
            result.push(sam);
        }

        if(onlyData) return result;
        return App.ok('查询成功', result, true);
    }
}

module.exports = Module;