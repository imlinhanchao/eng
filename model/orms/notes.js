const db = require('../db');
const prefix = require('../config').db.prefix;
let orm = {
    createId: {
        type: db.ID,
        comment: '创建者'
    },
    content: {
        type: db.TEXT,
        comment: '笔记'
    },
    word: {
        type: db.STRING(200),
        comment: '笔记所属单词'        
    },
    favcount: {
        type: db.INTEGER,
        comment: '收藏数',
        defaultValue: 0
    }
};
let table_name = prefix + 'notes';
module.exports = db.defineModel(table_name, orm, {
    comment: '帐号表',
});
module.exports.db = db;
module.exports.tb = table_name;
module.exports.keys = function () {
    return Object.keys(orm);
};