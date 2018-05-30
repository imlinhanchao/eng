<style scoped lang="less">
.layout{
    background: #f5f7f9;
    border-radius: 4px;
    overflow: hidden;
    min-height: 100%;
}
.layout-header {
    display: flex;
    background: transparent;
    position: relative;
}
.layout-main {
    width: 100%;
}
.layout-menu {
    display: flex;
    margin: auto;
    width: 100%;
    background: transparent;
}
.layout-logo{
    justify-content: flex-start;
    align-content: center; 
    margin: 5px auto;
    float: left;
    background-size: 100%;
    display: flex;
    img {
        width: 100%;
    }
}
.layout-nav{
    justify-content: flex-end;
    margin: 0 auto;
    margin-right: 0px;
}
.layout-sidebar {
    position: fixed;
    left: 0;
    height: 100%;
    z-index: 999;
}
.layout-footer{
    background: transparent;
    p {
        padding: 1em;
        text-align: center;
        position: absolute;
        right: 0;
        bottom: 0;
        color: #808080;
        z-index: inherit;
        width: 100%;
        overflow: hidden;
    }
}
.layout-user {
    color: #fff;
    padding: 10px 24px;
    font-size: 2em;
    line-height: 2em;
}
.menu-item {
    position: relative;
}

.menu-item span{
    display: inline-block;
    overflow: hidden;
    width: 69px;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width .2s ease .2s;
}
.menu-item i{
    transform: translateX(0px);
    transition: font-size .2s ease, transform .2s ease;
    vertical-align: middle;
    font-size: 16px;
}
.collapsed-menu span{
    width: 0px;
    transition: width .2s ease;
}
.collapsed-menu i{
    transform: translateX(5px);
    transition: font-size .2s ease .2s, transform .2s ease .2s;
    vertical-align: middle;
    font-size: 22px;
}
.new-meeting {
    box-shadow: 1px 1px 5px #AAA;
    border-radius: 2em;
    width: 4em;
    height: 4em;
    text-align: center;
    font-size: 1.2em;
    position: fixed;
    z-index: 1000;
    bottom: 1.5em;
    right: 3em;
}
.login-footer {
    text-align: center
}
</style>
<template>
    <Layout class="layout">
        <Sider :class="'layout-sidebar'" default-collapsed breakpoint="xl" collapsible :collapsed-width="0" v-model="isCollapsed">
            <Header class="layout-user" v-if="isLogin">
                <Icon type="person"></Icon>
                <span>{{name}}</span>
            </Header>
            <Menu active-name="1-1" theme="dark" width="auto" :class="menuitemClasses">
                <MenuItem name="1-1" v-if="isLogin">
                    <router-link to="/"><Icon type="ios-search-strong"></Icon>
                    <span>查询单词</span></router-link>
                </MenuItem>
                <MenuItem name="1-2" v-if="isLogin">
                    <router-link to="/notes"><Icon type="document-text"></Icon>
                    <span>我的笔记</span></router-link>
                </MenuItem>
                <MenuItem name="1-3" v-if="isLogin">
                    <router-link to="/star"><Icon type="android-star"></Icon>
                    <span>收藏的笔记</span></router-link>
                </MenuItem>
                <MenuItem name="1-4" v-if="isLogin">
                    <router-link to="/logout"><Icon type="log-out"></Icon>
                    <span>退出</span></router-link>
                </MenuItem>
                <MenuItem name="1-5" v-if="!isLogin">
                    <span @click="loginModel = true"><Icon type="log-in"></Icon>
                    <span>登录</span></span>
                </MenuItem>
            </Menu>
            <Footer class="layout-footer">
                <p>{{ (new Date()).getFullYear() }} &copy; <a hrep="https://github.com/imlinhanchao/eng" target="_blank">Hancel Lin</a></p>
            </Footer>
            <div slot="trigger"></div>
        </Sider>
        <Layout class="layout-main" :class="collapsed">
            <Header class="layout-header">
                <div class="layout-logo">
                    <img src="../assets/logo.svg" alt="自考英语查询" />
                </div>
            </Header>
            <Content :style="{padding: '15px 15px'}">
                <Layout>
                    <router-view />
                </Layout>
            </Content>
        </Layout>
        <Modal v-model="loginModel" title="登录" width="300">
            <Form ref="loginForm" :model="login" :rules="ruleValidate" class="layout-form">
                <FormItem prop="user">
                    <Input type="text" v-model="login.username" placeholder="用户名" @keyup.13="document.getElementById('password').focus()">
                        <Icon type="ios-person-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem prop="password">
                    <Input id="password" :type="passwdType" v-model="login.passwd" placeholder="密码" @keyup.13="loginSubmit('loginForm')">
                        <Icon type="ios-locked-outline" slot="prepend"></Icon>
                        <Button slot="append" :icon="showIcon" @click="isPasswdShow=!isPasswdShow" style="box-shadow:none;" :loading="login_loading"></Button>
                    </Input>
                </FormItem>
            </Form>
            <div slot="footer" class="login-footer">
                <Button type="primary" @click="loginSubmit('loginForm')" :loading="login_loading">登录</Button>
            </div>
        </Modal>
    </Layout>
</template>
<script>
    export default {
        data () {
            return {
                isCollapsed: false,
                loginUser: null,
                loginModel: false,
                login: {
                    username: '',
                    passwd: ''
                },
                isPasswdShow: false,
                ruleValidate: {
                    username: [
                        { required: true, message: '请输入用户名。', trigger: 'blur' }
                    ],
                    passwd: [
                        { required: true, message: '请输入密码。', trigger: 'blur' },
                    ]
                },
                login_loading: false
            };
        },
        computed: {
            menuitemClasses () {
                return [
                    'menu-item',
                    this.isCollapsed ? 'collapsed-menu' : ''
                ]
            },
            name () {
                return this.loginUser ? this.loginUser.name : '';
            },
            isLogin () {
                return !!this.loginUser;
            },
            collapsed() {
                return [
                    this.isCollapsed ? "collapsed" : ""
                ]
            },
            showIcon() {
                return this.isPasswdShow ? 'eye-disabled' : 'eye'
            },
            passwdType () {
                return this.isPasswdShow ? 'text' : 'password'
            }
        },
        methods: {
            newMeeting() {
                this.$router.push(`/new`);
            },
            loginSubmit() {

            }
        }
    }
</script>