const crypto = require('crypto');
const model = require('../model');
const App = require('./app');
const Account = model.account;

const __salt = require('../config').salt;

let __error__ = Object.assign({}, App.error);
__error__.verify = App.error.reg('帐号或密码错误！');
__error__.existed = App.error.existed('帐号');

class Module extends App {
    constructor(session) {
        super([
            { fun: App.ok, name: 'oklogin', msg: '登录成功' },
            { fun: App.ok, name: 'oklogout', msg: '登出成功' },
            { fun: App.ok, name: 'okget', msg: '获取成功' },
        ]);
        this.session = session;
        this.name = '用户';
        this.saftKey = ['id'].concat(Account.keys().filter(k => ['passwd'].indexOf(k) < 0));
    }

    get error() {
        return __error__;
    }
    
    async login(data) {
        const keys = ['username', 'passwd'];

        if (!App.haskeys(data, keys)) {
            throw (this.error.param);
        }

        data = App.filter(data, keys);

        try {
            let account = await this.exist(data.username, true);
            if(!account) {
                account = await this.create(data, true);
            } else {
                let sha256 = crypto.createHash('sha256');
                let passwd = sha256.update(data.passwd + __salt).digest('hex');
                if (account.passwd != passwd) {
                    throw this.error.verify;
                }
            }

            this.session.account_login = account;
            return this.oklogin(App.filter(this.session.account_login, this.saftKey));
        } catch (err) {
            if (err.isdefine) throw (err);
            throw (this.error.network(err));
        }
    }

    async create(data, onlyData = false) {
        const keys = ['username', 'passwd'];

        if (!App.haskeys(data, keys)) {
            throw (this.error.param);
        }

        data = App.filter(data, Account.keys());
        
        try {
            let account = await this.exist(data.username, true);
            if (account) {
                throw (this.error.existed);
            }
            
            data.nickname = data.username;
            data.lastlogin = new Date().valueOf() / 1000;
            let sha256 = crypto.createHash('sha256');
            data.passwd = sha256.update(data.passwd + __salt).digest('hex');
            account = await super.new(data, Account);
            if (onlyData) return account;
            return this.okcreate(App.filter(account, this.saftKey));
        } catch (err) {
            if (err.isdefine) throw (err);
            throw (this.error.db(err));
        }
    }

    async update(data) {
        const keys = ['username'];

        if (!App.haskeys(data, keys)) {
            throw (this.error.param);
        }

        data = App.filter(data, Account.keys());

        try {
            let account = this.info(true);
            if (account.username != data.username) {
                throw this.error.limited;
            }
            // 用户名不可更改
            data.username = undefined;
            if (account.passwd) {
                let sha256 = crypto.createHash('sha256');
                let passwd = sha256.update(data.oldpasswd + __salt).digest('hex');
                if (account.passwd != passwd) {
                    throw this.error.verify;
                }
            }
            return this.okupdate(await super.set(data, Account));
        } catch (err) {
            if (err.isdefine) throw (err);
            throw (this.error.db(err));
        }
    }

    async exist(username, onlyData = false) {
        try {
            let data = await Account.findOne({
                where: {
                    username: username
                }
            });
            if (onlyData) return data;
            return this.okget(!!data);
        } catch (err) {
            if (err.isdefine) throw (err);
            throw (this.error.db(err));
        }
    }

    logout() {
        if (!this.islogin) {
            throw (this.error.nologin);
        }
        this.session.account_login = undefined;
        return this.oklogout();
    }

    get islogin() {
        return this.session && this.session.account_login;
    }

    info(onlyData = false, fields=null) {
        if (!this.islogin) {
            throw (this.error.nologin);
        }
        fields = fields || this.saftKey;
        if (onlyData == true) return App.filter(this.session.account_login, fields);
        return this.okget(App.filter(this.session.account_login, fields));
    }

    async query(query, fields=null, onlyData=false) {
        let ops = {
            id: App.ops.in,
            username: App.ops.equal,
        };
        query = App.filter(query, Object.keys(ops));
        try {
            let data = {
                index: 0,
                count: -1,
                query
            };
            data.fields = fields || this.saftKey;
            let queryData = await super.query(
                data, Account, ops
            );
            if (onlyData) return queryData;
            return this.okquery(queryData);
        } catch (err) {
            throw (err);
        }
    }

    get userId() {
        if (!this.islogin) {
            throw (this.error.nologin);
        }
        return this.session.account_login.id;
    }
}

module.exports = Module;