const crypto = require('crypto');
const model = require('../model');
const App = require('./app');
const Account = model.account;

const __salt = require('../config').salt;

let __error__ = Object.assign({}, App.error);
__error__.verify = App.error.reg('帐号或密码错误！');
__error__.exist = App.error.existed('帐号');

class Module extends App {
    constructor() {
        super([
            { fun: App.ok, name: 'oklogin', msg: '登录成功' },
            { fun: App.ok, name: 'oklogout', msg: '登出成功' },
            { fun: App.ok, name: 'okget', msg: '获取成功' },
        ]);
    }

    get error() {
        return __error__;
    }
    
    async login(data) {
        const keys = ['user', 'passwd'];

        if (!App.haskeys(data, keys)) {
            throw (this.error.param);
        }

        data = App.filter(data, keys);

        try {
            let account = await this.exist(data, false);
            if(!account) {
                this.create(data, false);
            }

            let sha256 = crypto.createHash('sha256');
            let passwd = sha256.update(data.passwd + __salt).digest('hex');
            if (account.passwd != passwd) {
                throw this.error.verify;
            }

            this.session.account_login = account;
            return this.oklogin(this.session.account_login);
        } catch (err) {
            if (err.isdefine) throw (err);
            throw (this.error.network(err));
        }
    }

    async create(data, bJson = true) {
        try {
            let account = await this.exist(data, false);
            if (account) {
                throw (this.error.existed);
            }
            
            data.nickname = data.username;
            let sha256 = crypto.createHash('sha256');
            data.passwd = sha256.update(data.passwd + __salt).digest('hex');
            account = await super.create(data, Account);
            if (!bJson) return account;
            return this.okcreate(account);
        } catch (err) {
            if (err.isdefine) throw (err);
            throw (this.error.db(err));
        }
    }

    async update(data) {
        try {
            // 用户名不可更改
            let account = this.info(false);
            if (account.username != data.username) {
                throw this.error.limited;
            }
            data.username = undefined;
            let sha256 = crypto.createHash('sha256');
            let passwd = sha256.update(data.oldpasswd + __salt).digest('hex');
            if (account.passwd != passwd) {
                throw this.error.verify;
            }
            return this.okupdate(await super.set(data, Account));
        } catch (err) {
            if (err.isdefine) throw (err);
            throw (this.error.db(err));
        }
    }

    async exist(username, bJson = true) {
        try {
            let data = await Account.findOne({
                where: {
                    username: data.username
                }
            });
            if (!bJson) return data;
            return this.okget(!!data);
        } catch (err) {
            if (err.isdefine) throw (err);
            throw (this.error.network(err));
        }
    }

    logout() {
        if (!this.session || !this.session.account_login) {
            throw (this.error.nologin);
        }
        this.session.account_login = undefined;
        return this.oklogout();
    }

    get islogin() {
        return this.session && this.session.account_login;
    }

    info(bJson = true) {
        if (!this.session || !this.session.account_login) {
            throw (this.error.nologin);
        }
        if (!bJson) return this.session.account_login;
        return this.okget(this.session.account_login);
    }
}

module.exports = Module;