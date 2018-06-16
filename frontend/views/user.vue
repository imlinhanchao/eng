
<style lang="less" scoped>
.login-time {
    font-size: .8em;
    margin-top: .5em;
}
.user-info {
    margin: 0 0 1em;
}
.name {
    background: #495060;
    margin: 0;
    padding: 0 .2em;
    display: inline-block;
    color: #FFF;
}
</style>
<template>
    <Layout>
        <section class="user-info">
            <header>
                <h1 class="name">{{info.nickname}}</h1>
                <p class="login-time">上次登录时间：{{new Date(info.lastlogin * 1000).toLocaleString('zh-CN', {hour12: false})}}</p>
            </header>
        </section>
        <Tabs value="notes">
            <TabPane label="我的笔记" name="notes">
                <notes-list
                    :query="{
                        createUser: info.username
                    }"
                    :order="[
                        'word'
                    ]"
                    tip="还没有创建任何笔记哦~"
                ></notes-list>
            </TabPane>
            <TabPane label="我的收藏" name="star">
                <notes-list
                    :query="{
                        favUser: info.username
                    }"
                    :order="[
                    ]"
                    tip="还没有收藏任何笔记哦~"
                ></notes-list>
            </TabPane>
        </Tabs>
    </Layout>
</template>
<script>
    import notesList from '../components/notesList'
    export default {
        components: {
            notesList
        },
        data () {
            return {
                info: {
                    username: '',
                    nickname: '',
                    lastlogin: 0
                }
            }
        },
        methods: {
            getUser (username) {
                this.$store.dispatch('getInfo', {
                    username,
                    callback: (rsp) => {
                        if (rsp.state == 0) {
                            if(!rsp.data.total) {
                                return this.$Message.error({
                                    content: '用户不存在',
                                    duration: 5,
                                    onClose: () => {
                                        this.$router.push('/')
                                    }
                                });
                            }
                            this.info = rsp.data.data[0];
                        } else {
                            this.$Message.error(error.message);
                        }
                    }
                })
            }
        },
        watch: {
            '$route.params.user'(val) {
                this.getUser(val);
            }
        },
        mounted () {
            if (this.$route.params.user) {
                this.getUser(this.$route.params.user);
            }
        }
    };
</script>