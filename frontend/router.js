const routers = [{
    path: '/',
    meta: {
        title: '首页'
    },
    component: (resolve) => require(['./views/index.vue'], resolve),
    beforeRouteEnter(to, from, next) {
        if(!this.$root.loginUser) {
            to = '/login';
            next();
        }
    },
    children: [
        {
            path: '',
            meta: {
                title: '首页'
            },
            component: (resolve) => require(['./views/home.vue'], resolve)
        },{
            path: 'notes',
            meta: {
                title: '我的笔记'
            },
            component: (resolve) => require(['./views/notes.vue'], resolve)
        },{
            path: 'star',
            meta: {
                title: '收藏的笔记'
            },
            component: (resolve) => require(['./views/star.vue'], resolve)
        }
    ]
    },{
        path: '/',
        meta: {
            title: '单词'
        },
        component: (resolve) => require(['./views/index.vue'], resolve),
        children: [{
            path: '/w/:word',
            meta: {
                title: '单词'
            },
            component: (resolve) => require(['./views/home.vue'], resolve)
        }]
    }, {
        path: '*',
        redirect: '/'
    }
];
export default routers;