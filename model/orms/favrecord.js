const db = require('../db');
const prefix = require('../config').db.prefix;
let orm = {
    userId: {
        type: db.ID,
        comment: '收藏者'
    },
    noteId: {
        type: db.ID,
        comment: '笔记Id'
    },
    word: {
        type: db.STRING(200),
        comment: '笔记所属单词'
    }
};
let table_name = prefix + 'fav_record';
module.exports = db.defineModel(table_name, orm, {
    comment: '收藏记录表',
});
module.exports.db = db;
module.exports.tb = table_name;
module.exports.keys = function () {
    return Object.keys(orm);
};