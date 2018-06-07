const crypto = require('crypto');
const model = require('../model');
const App = require('./app');
const Notes = model.notes;

const __salt = require('../config').salt;

let __error__ = Object.assign({}, App.error);
__error__.verify = App.error.reg('帐号或密码错误！');
__error__.exist = App.error.existed('帐号');

class Module extends App {
    constructor(session) {
        super([]);
        this.session = session;
        this.name = '笔记';
        this.saftKey = Notes.keys().concat(['id']);
    }

    get error() {
        return __error__;
    }
    
    async create(data) {
        const keys = ['content', 'word'];

        if (!App.haskeys(data, keys)) {
            throw (this.error.param);
        }

        data = App.filter(data, Notes.keys());
        
        try {
            data.createId = this.userId;
            data.favcount = 0;
            return this.okcreate(App.filter(await super.new(data, Notes), this.saftKey));
        } catch (err) {
            if (err.isdefine) throw (err);
            throw (this.error.db(err));
        }
    }

    async update(data) {
        const keys = ['id'];

        if (!App.haskeys(data, keys)) {
            throw (this.error.param);
        }

        data = App.filter(data, Notes.keys());

        try {
            // 更新内容不许修改收藏总数
            data.favcount = undefined;
            // 创建者不许修改
            data.createId = undefined;
            return this.okupdate(App.filter(await super.set(data, Notes), this.saftKey));
        } catch (err) {
            if (err.isdefine) throw (err);
            throw (this.error.db(err));
        }
    }

    async star(id) {
        try {
            let data = await Notes.findOne({
                where: {
                    id: id
                }
            });
            data.favcount += 1;
            data.save()
            return data.favcount;
        } catch (err) {
            if (err.isdefine) throw (err);
            throw (this.error.db(err));
        }
    }

    get userId() {
        if (!this.session || !this.session.account_login) {
            throw (this.error.nologin);
        }
        return this.session.account_login.id;
    }
}

module.exports = Module;