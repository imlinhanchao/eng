const crypto = require('crypto');
const model = require('../model');
const App = require('./app');
const Account = require('./account');
const Notes = model.notes;
const FavRecord = model.favrecord;

let __error__ = Object.assign({}, App.error);
__error__.verify = App.error.reg('帐号或密码错误！');
__error__.exist = App.error.existed('帐号');

class Module extends App {
    constructor(session) {
        super([]);
        this.session = session;
        this.name = '笔记';
        this.saftKey = Notes.keys().concat(['id']);
        this.account = new Account(session);
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
            data.createId = this.account.userId;
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

        if (data.createId != this.account.userId) {
            throw this.error.unauthorized
        }

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
            let record = await FavRecord.findOne({
                where: {
                    noteId: id,
                    userId: this.account.userId
                }
            });

            let data = await Notes.findOne({
                where: {
                    id: id
                }
            });

            if (record) {
                record.destory();
            }

            data.favcount += record ? -1 : 1;

            data.save()
            return data.favcount;
        } catch (err) {
            if (err.isdefine) throw (err);
            throw (this.error.db(err));
        }
    }

    async query(data, onlyData = false) {
        let ops = {
            createId: App.ops.equal,
            word: App.ops.equal,
        };
        try {
            data.query = data.query || {};
            let queryData = await super.query(
                data, Notes, ops
            );
            
            let userIds = queryData.data.map(d => d.createId);
            let noteIds = queryData.data.map(d => d.id);
            let users = await this.account.getUsers(userIds, ['id', 'nickname'], true);
            let favs = FavRecord.findAll({
                where: {
                    noteId: {
                        '$in': noteIds
                    }
                }
            })
            queryData.data = queryData.data.map(d => {
                let user = users.data.filter(u => u.id == d.createId)
                d.nickname = user.length > 0 ? user[0].nickname : 'unknown';
                d.canEdit = d.createId == this.account.userId;
                d.isliked = favs.filter(f => f.noteId == d.id && f.userId == this.account.userId).length > 0;
                d.createId = undefined;
                return d
            })

            if (onlyData) return queryData;
            return this.okquery(queryData);
        } catch (err) {
            throw (err);
        }
    }
}

module.exports = Module;