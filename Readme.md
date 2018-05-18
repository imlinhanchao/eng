# 自考英语二查询网站

## 使用方法
1. 你可以通过输入『页码 序号』查询自考英语二 附录二中指定页码指定序号单词。如：39 2
2. 你可以通过单词查询，输入过程会提示自考英语二 附录二中单词，点击提示可以直达。

## 目录说明
A. bin - 服务启动入口  
B. interface - 业务接口实现   
C. fontend - 前端代码  
D. lib - 公共类库  
E. pubilc - 静态资源  
F. routes - 服务路由  
G. view - 视图   

## 部署说明
服务器需安装`nodejs`和`npm`。部署执行如下脚本：
```bash
npm install
```
编译前端代码：  
```bash
npm run build
```

启动服务：
```bash
npm start
```

以守护进程方式，启动服务：
```bash
forever start ./bin/www
```

## 端口号
- 7803

## 接口文档
TBD