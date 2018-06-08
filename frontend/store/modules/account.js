import axios from 'axios';

const state = {
    loginUser: null
}
const mutations = {
    setLoginUser (state, user) {
        state.loginUser = user;
    }
}
const actions = {
    login ({ state, commit }, { user, callback }) {
        axios.post(`/api/account/login`, user)
            .then((rsp) => {
                rsp = rsp.data;
                if (rsp.state == 0) {
                    commit('setLoginUser', rsp.data);
                }
                callback(rsp)
            })
            .catch((error) => {
                callback(null, error);
                console.error(error.message);
            });
    },
    logout ({ commit }, callback) {
        axios.get(`/api/account/logout`)
            .then((rsp) => {
                rsp = rsp.data;
                if (rsp.state == 0) {
                    commit('setLoginUser', null);
                }
                callback(rsp)
            })
            .catch((error) => {
                callback(null, error);
                console.error(error.message);
            });
    },
    checklogin ({ commit }, callback) {
        axios.get(`/api/account/info`)
            .then((rsp) => {
                rsp = rsp.data;
                if (rsp.state == 0) {
                    commit('setLoginUser', rsp.data);
                }
                callback(rsp)
            })
            .catch((error) => {
                callback(null, error);
                console.error(error.message);
            });
    }
}
const getters = {
    isLogin: (state) => {
        return !!state.loginUser;
    },
    userInfo: (state) => {
        return state.loginUser;
    }
}
export default {
    state,
    mutations,
    getters,
    actions
}