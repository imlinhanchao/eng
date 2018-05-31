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
        },
    ]
    }, {
        path: '*',
        redirect: '/'
    }
];
export default routers;