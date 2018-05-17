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
</style>
<template>
    <Layout class="layout">
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
    </Layout>
</template>
<script>
    export default {
        data () {
            return {
                isCollapsed: false
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
                return this.$root.loginUser ? this.$root.loginUser.name : '';
            },
            collapsed() {
                return [
                    this.isCollapsed ? "collapsed" : ""
                ]
            }
        },
        methods: {
            newMeeting() {
                this.$router.push(`/new`);
            }
        }
    }
</script>