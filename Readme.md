# 深信通API接口服务

## 目录说明
A. bin - 服务启动入口  
B. interface - 业务接口实现   
C. model - 数据对象模型  
D. lib - 公共类库  
E. pubilc - 静态资源  
F. routes - 服务路由  
G. view - 视图    
H. script - 服务脚本

## 部署说明
服务器需安装`nodejs`和`npm`。部署执行如下脚本：
```bash
npm install
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
- 3200

## 接口文档
TBD