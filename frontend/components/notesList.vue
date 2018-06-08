<style lang="less" scoped>
.notes-content {
    padding-right: 3em;
}
.notes-none {
    margin: 1em 0;
}
.notes-list {
    list-style: none;
    .notes-item {
        position: relative;
        font-weight: 400;
        .notes-info {
            margin: .5em 0 1em;
            border-bottom: 1px dashed #CCC;
            font-size: .8em;
            color: #BBB;
            display:flex;
            justify-content:space-between;
            span {
                display: inline-block;
            }
        }
    }
}

.toolbar {
    position: absolute;
    right: 0;
    top: -.5em;
    button {
        padding: 0;
    }
    .fav-btn {
        i {
            font-size: 1.5em;
        }
        * {
            vertical-align: text-bottom;
        }
    }
    .edit-btn {
        font-size: 1em;
    }
}
.big-fixed-btn {
    box-shadow: 1px 1px 5px #AAA;
    border-radius: 2em;
    width: 4em;
    height: 4em;
    text-align: center;
    font-size: 1.2em;
    position: fixed;
    z-index: 1000;
    bottom: 1.5em;
    right: 1em;
}
.title {
    background: #495060;
    margin: 0 0 1em;
    padding: 0 .2em;
    display: inline-block;
    color: #FFF;
}
</style>
<template>
    <Layout>
        <article v-if="notes.data.length">
            <header>
                <h1 class="title">{{title}}</h1>
            </header>
            <section>
                <ul class="notes-list">
                    <li class="notes-item" v-for="item in notes.data" :key="item.id">
                        <h2 class="word-title">{{item.word}}</h2>
                        <div class="toolbar">
                            <Button class="edit-btn" type="text" icon="edit" v-if="item.canEdit" @click="launchUpdate(item)"></Button>
                            <Button class="fav-btn" type="text" v-if="$store.getters.isLogin" @click="star(item)">
                                {{item.favcount}}
                                <Icon :type="likedIcon(item)" ></Icon>
                            </Button>
                        </div>
                        <div class="notes-content markdown-preview" v-html="compiledMarkdown(item.content)"></div>
                        <p class="notes-info">
                            <span class="nickname">{{item.nickname}}</span>
                            <span class="createtime">{{new Date(item.create_time * 1000).toLocaleString('zh-CN', {hour12: false})}}</span>
                        </p>
                    </li>
                </ul>
            </section>
            <section v-if="notes.total / count > 1">
                <Page simple :total="notes.total" :page-size="5" @on-change="change"></Page>
            </section>
        </article>
        <article v-if="!notes.data.length">
            <p class="notes-none">还没有任何笔记哦~ 快快去查询单词添加笔记吧！</p>
        </article>
        <Modal v-model="notesModal" title="笔记" width="700" @on-cancel="notesInput=''">
           <Tabs type="card">
                <TabPane label="笔记" icon="social-markdown">
                    <Input v-model="notesInput" type="textarea" placeholder="支持 markdown。" 
                    :autosize="{ minRows: 5, maxRows: 15 }" size="default"/>
                </TabPane>
                <TabPane label="预览" icon="eye">                
                    <section class="markdown-preview" v-html="compiledMarkdown(notesInput)"></section>
                </TabPane>
            </Tabs>
            <input type="hidden" name="noteid" v-model="notesId" />
            <div slot="footer" class="login-footer">
                <Button type="primary" @click="updateNotes" :loading="noteloading">更新</Button>
            </div>
        </Modal>
    </Layout>
</template>
<script>
export default {
    name: 'notes',
    props: {
        query: {
            type: Object,
            required: true
        },
        title: {
            type: String,
            default: '笔记'
        },
        order: {
            type: Array,
            default: []
        }
    },
    watch: {
        query (val) {
            this.queryNotes()
        }
    },
    data () {
      return {
            index: 0,
            count: 5,
            notes: {
                data: [],
                total: 0
            },
            notesModal: false,
            notesInput: '',
            notesId: '',
            noteloading: false
      }
    },
    methods: {
        compiledMarkdown (notes) {
            return this.$marked(notes, { sanitize: true })
        },
        change (page) {
            this.index = (page - 1) * this.count;
            this.queryNotes();
        },
        queryNotes () {
            this.$axios.post(`/api/notes/query`, {
                    index: this.index, 
                    count: this.count,
                    order: this.order,
                    query: this.query
                })
                .then((rsp) => {
                    rsp = rsp.data;
                    if (rsp.state == 0) {
                        // this.$Message.info(rsp.msg);
                        this.notes = rsp.data
                    } else {
                        this.$Message.error(`载入笔记失败：${rsp.msg}`);
                    }
                })
                .catch((error) => {
                    this.$Message.error(error.message);
                    console.error(error.message);
                });
        },
        star (notes) {
            this.$axios.get(`/api/notes/star/${notes.id}`)
                .then((rsp) => {
                    rsp = rsp.data;
                    if (rsp.state == 0) {
                        this.$Message.success(notes.isliked ? '取消收藏成功' : '收藏成功');
                        this.queryNotes();
                    } else {
                        this.$Message.error(`${notes.isliked ? '取消收藏' : '收藏'}笔记失败：${rsp.msg}`);
                    }
                })
                .catch((error) => {
                    this.$Message.error(error.message);
                    console.error(error.message);
                });
        },
        updateNotes () {
            if (!this.notesInput.trim()) {
                this.$Message.error('笔记不能为空！');
                return;
            }
            this.noteloading = true;
            this.$axios.post(`/api/notes/update`, {
                    id: this.notesId,
                    content: this.notesInput
                })
                .then((rsp) => {
                    rsp = rsp.data;
                    this.noteloading = false;
                    if (rsp.state == 0) {
                        this.newMode = true;
                        this.notesModal = false;
                        this.notesInput = '';
                        this.$Message.success(rsp.msg);
                        this.queryNotes();
                    } else {
                        this.$Message.error(rsp.msg);
                    }
                })
                .catch((error) => {
                    this.$Message.error(error.message);
                    console.error(error.message);
                });
        },
        launchUpdate(notes) {
            this.notesId = notes.id;
            this.newMode = false;
            this.notesModal = true;
            this.notesInput = notes.content;
        },
        likedIcon (notes) {
            return notes.isliked ? 'android-star' : 'android-star-outline'
        }
    },
    mounted () {
        this.queryNotes()
    },
    computed: {
    }
}
</script>
