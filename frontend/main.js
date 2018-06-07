import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import Routers from './router';
import Vuex from 'vuex';
import Util from './libs/util';
import App from './app.vue';
import store from './store'
import 'iview/dist/styles/iview.css';
import './theme/index.less';
import axios from 'axios';
import marked from 'marked';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = Util.ajaxUrl;
Vue.prototype.$axios = axios;
Vue.prototype.$marked = marked;

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(iView);



// 路由配置
const RouterConfig = {
    mode: 'history',
    routes: Routers
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);
    next();
});

router.afterEach(() => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
    data: {
    },
    beforeMount() {
    },
    methods: {
    },
    computed: {
    },
    mounted () {
        this.$store.dispatch('checklogin', (rsp, err) => {})
    }
});