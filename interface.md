api 接口设计，地址：domain.com/api

# 登录

> /login

Post:
```json
{
    "user": "admin",
    "passwd": "1233456"
}
```

Response:
```json
{
    "state": "0",
    "msg": "登录成功",
    "data": {
        "token": "assreiorcxljdfhlcmlskorelcsmxlj"
    }
}
```

# 新增

> /book/new

Post:
```json
{
    "token": "assreiorcxljdfhlcmlskorelcsmxlj",
    "data": {
        "dbid": "25927585",
        "img": "https://img3.doubanio.com/lpic/s27445100.jpg",
        "name": "代码之髓",
        "author": "[日] 西尾泰和",
        "page": "236",
        "pub": "人民邮电出版社",
        "ISBN": "9787115361530",
        "pubdate": "2014-8"
    }
}
```

Response:
```json
{
    "state": "0",
    "msg": "新增成功",
    "data": {
        "id": "291"
    }
}
```

# 修改

> /book/update

Post:
```json
{
    "token": "assreiorcxljdfhlcmlskorelcsmxlj",
    "data": {
        "id": "291",
        "dbid": "25927585",
        "img": "https://img3.doubanio.com/lpic/s27445100.jpg",
        "name": "代码之髓",
        "author": "[日] 西尾泰和",
        "page": "236",
        "pub": "人民邮电出版社",
        "ISBN": "9787115361530",
        "pubdate": "2014-8"
    }
}
```

Response:
```json
{
    "state": "0",
    "msg": "更新成功",
    "data": {
        "id": "291"
    }
}
```

# 删除

> /book/del

Post:
```json
{
    "token": "assreiorcxljdfhlcmlskorelcsmxlj",
    "data": {
        "id": "291",
    }
}
```

Response:
```json
{
    "state": "0",
    "msg": "删除成功",
    "data": {
        "id": "291"
    }
}
```

# 阅读进度接口

> /book/read

Post:
```json
{
    "token": "assreiorcxljdfhlcmlskorelcsmxlj",
    "data": {
        "id": "291",
        "schedule": "236"
    }
}
```

Response:
```json
{
    "state": "0",
    "msg": "更新进度成功",
    "data": {
        "id": "291",
        "percent": "100"
    }
}
```

# 查询（列表）

> /book/list

Post:
```json
{
    "query": {
        "key": "value",
    },
    "index": "0",
    "count": "10",
    "field": [ "id", "dbid", "img", "name", "author", "page", "pub", "ISBN", "pubdate", "lend", "read" ] // 可选
}
```

Response:
```json
{
    "state": "0",
    "msg": "查询成功",
    "data": [
        {
            "id": "291",
            "dbid": "25927585",
            "img": "https://img3.doubanio.com/lpic/s27445100.jpg",
            "name": "代码之髓",
            "author": "[日] 西尾泰和",
            "page": "236",
            "pub": "人民邮电出版社",
            "ISBN": "9787115361530",
            "pubdate": "2014-8",
            "lend": "true",
            "state": "readed", // readed - 已读， reading - 在读, unread - 未读
            "schedule": "236"
        },
        {
            "id": "291",
            "dbid": "25927585",
            "img": "https://img3.doubanio.com/lpic/s27445100.jpg",
            "name": "代码之髓",
            "author": "[日] 西尾泰和",
            "page": "236",
            "pub": "人民邮电出版社",
            "ISBN": "9787115361530",
            "pubdate": "2014-8",
            "lend": "true",
            "state": "readed", // readed - 已读， reading - 在读, unread - 未读
            "schedule": "236"
        }
    ]
}
```

# 查询（单个）

> /book/get/:id

Post(可选):
```json
{
    "field": [ "id", "dbid", "img", "name", "author", "page", "pub", "ISBN", "pubdate" ]
}
```

Response:
```json
{
    "state": "0",
    "msg": "查询成功",
    "data": [
        {
            "id": "291",
            "dbid": "25927585",
            "img": "https://img3.doubanio.com/lpic/s27445100.jpg",
            "name": "代码之髓",
            "author": "[日] 西尾泰和",
            "page": "236",
            "pub": "人民邮电出版社",
            "ISBN": "9787115361530",
            "pubdate": "2014-8"
        },
        {
            "id": "291",
            "dbid": "25927585",
            "img": "https://img3.doubanio.com/lpic/s27445100.jpg",
            "name": "代码之髓",
            "author": "[日] 西尾泰和",
            "page": "236",
            "pub": "人民邮电出版社",
            "ISBN": "9787115361530",
            "pubdate": "2014-8"
        }
    ]
}
```

# 借阅/归还接口

> /lend/book

Post:
```json
{
    "token": "assreiorcxljdfhlcmlskorelcsmxlj",
    "data": {
        "id": "291",
        "user": "姓名",
        "return": "2017-04-17"
    }
}
```

Response:
```json
{
    "state": "0",
    "msg": "借阅成功",
    "data": {
        "id": "291",
    }
}
```

# 借阅查询

> /lend/list

Post:
```json
{
    "token": "assreiorcxljdfhlcmlskorelcsmxlj",
    "query": {
        "key": "value",
    },
    "index": "0",
    "count": "10",
    "field": [ "id", "dbid", "img", "name", "author", "page", "pub", "ISBN", "pubdate", "state" ] // 可选， 默认返回 id, name
}
```

Response:
```json
{
    "state": "0",
    "msg": "查询成功",
    "data": [
        {
            "lend": {
                "user": "姓名",
                "create": "2017-01-04",
                "return": "2017-04-17",
            },
            "book": {
                "id": "291",
                "dbid": "25927585",
                "img": "https://img3.doubanio.com/lpic/s27445100.jpg",
                "name": "代码之髓",
                "author": "[日] 西尾泰和",
                "page": "236",
                "pub": "人民邮电出版社",
                "ISBN": "9787115361530",
                "pubdate": "2014-8",
                "state": "readed", // readed - 已读， reading - 在读, unread - 未读
            }
        }
    ]
}
```