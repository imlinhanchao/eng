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
        super([
            { fun: App.ok, name: 'okstar', msg: '收藏成功' }
        ]);
        this.session = session;
        this.name = '笔记';
        this.saftKey = Notes.keys().concat(['id']);
        this.account = new Account(session);
    }

    get error() {
        return __error__;
    }
    
    async create(data) {
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
        try {
            // 更新内容不许修改收藏总数
            data.favcount = undefined;
            // 创建者不许修改
            data.createId = undefined;
            return this.okupdate(App.filter(await super.set(data, Notes, (notes) => {
                if (notes.createId != this.account.userId) {
                    throw this.error.unauthorized;
                }
            }), this.saftKey));
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

            let like = !!record;
            data.favcount += like ? -1 : 1;

            if (like) {
                record.destroy();
            } else {
                FavRecord.create({
                    noteId: id,
                    userId: this.account.userId,
                    word: data.word
                });
            }

            data.save();
            return this.okstar(like);
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

            if (data.query.createUser) {
                let users = await this.account.query({
                    username: data.query.createUser
                }, ['id'], true);
                if (users.total)
                    data.query.createId = users.data[0].id;
            }

            if (data.query.favUser) {
                let users = await this.account.query({
                    username: data.query.favUser
                }, ['id'], true);
                if (users.total)
                    data.query.favUserId = users.data[0].id;
            }

            if (data.query.favUserId) {
                let favs = this.account.islogin ? await FavRecord.findAll({
                    where: {
                        userId: data.query.favUserId
                    }
                }) : [];
                if (favs) {
                    data.query.id = {
                        op: App.ops.in,
                        val: favs.map(f => f.noteId)
                    };
                }
            }

            let queryData = await super.query(
                data, Notes, ops
            );
            
            let userIds = queryData.data.map(d => d.createId);
            let noteIds = this.account.islogin ? queryData.data.map(d => d.id) : null;
            let users = await this.account.query({ id: userIds }, ['id', 'nickname', 'username'], true);
            let favs = this.account.islogin ? await FavRecord.findAll({
                where: {
                    noteId: {
                        '$in': noteIds
                    }
                }
            }) : null;
            queryData.data = queryData.data.map(d => {
                let user = users.data.filter(u => u.id == d.createId);
                d.nickname = user.length > 0 ? user[0].nickname : 'unknown';
                d.username = user.length > 0 ? user[0].username : 'unknown';
                d.canEdit = this.account.islogin ? d.createId == this.account.userId : false;
                
                d.isliked = this.account.islogin ? favs.filter(f => f.noteId == d.id && f.userId == this.account.userId).length > 0 : false;
                d.createId = undefined;
                return d;
            });

            if (onlyData) return queryData;
            return this.okquery(queryData);
        } catch (err) {
            throw (err);
        }
    }
}

module.exports = Module;