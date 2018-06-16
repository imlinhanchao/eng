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
.toolform {
    margin: 1em 0;
}
</style>
<template>
    <Layout>
        <article v-if="notes.data.length">
            <section>
                <ul class="notes-list">
                    <li class="notes-item" v-for="item in notes.data" :key="item.id">
                        <div class="toolbar">
                            <Button class="edit-btn" type="text" icon="edit" v-if="item.canEdit" @click="launchUpdate(item)"></Button>
                            <Button class="fav-btn" type="text" v-if="$store.getters.isLogin" @click="star(item)">
                                {{item.favcount}}
                                <Icon :type="likedIcon(item)" ></Icon>
                            </Button>
                        </div>
                        <div class="notes-content markdown-preview" v-html="compiledMarkdown(item.content)"></div>
                        <p class="notes-info">
                            <span class="nickname"><router-link :to="`/u/${item.username}`">{{item.nickname}}</router-link></span>
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
            <p class="notes-none">还没有任何笔记哦~ <span v-if="$store.getters.isLogin">快快点击右边的大按钮添加你的笔记吧！</span></p>
        </article>
        <Layout v-if="$store.getters.isLogin && word">
           <Button type="primary" class="big-fixed-btn" @click="notesModal=true"><Icon type="plus-round"></Icon></Button>
        </Layout>
        <Modal v-model="notesModal" title="笔记" width="700" @on-cancel="notesInput=''">
            <p class="toolform">
                <Checkbox v-model="autoword">自动将所有 ~ 替换为当前单词</Checkbox>
            </p>
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
                <Button type="primary" @click="newNotes" :loading="noteloading">{{submitWord}}</Button>
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
        order: {
            type: Array,
            default: []
        },
        word: {
            type: String,
            default: ''
        }
    },
    watch: {
        query (val) {
            this.queryNotes()
        },
        notesInput (val) {
            if (this.autoword && val.indexOf('~') >= 0) {
                this.notesInput = val.replace(/([^\\]|)~/g, `$1${this.word}`);
            }
            if (this.notesInput.match(/([^\s]{1,2}|^)\n/g)) {
                this.notesInput = this.notesInput.replace(/([^\s]{1,2}|^)\n/g, '$1  \n')
            }
        },
        autoword (val) {
            if (this.autoword && this.notesInput.indexOf('~') >= 0) {
                this.notesInput = this.notesInput.replace(/([^\\]|)~/g, `$1${this.word}`);
            }
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
            noteloading: false,
            newMode: true,
            autoword: true
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
        newNotes () {
            if (!this.notesInput.trim()) {
                this.$Message.error('笔记不能为空！');
                return;
            }
            this.noteloading = true;
            if (!this.newMode) return this.updateNotes();
            this.$axios.post(`/api/notes/create`, {
                    word: this.word,
                    content: this.notesInput
                })
                .then((rsp) => {
                    rsp = rsp.data;
                    this.notesInput = '';
                    this.noteloading = false;
                    this.queryNotes();
                    if (rsp.state == 0) {
                        this.notesModal = false;
                        this.$Message.success(rsp.msg);
                    } else {
                        this.$Message.error(rsp.msg);
                    }
                })
                .catch((error) => {
                    this.$Message.error(error.message);
                    console.error(error.message);
                });
        },
        updateNotes () {
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
        submitWord () {
            return this.newMode ? '添加' : '更新'
        }
    }
}
</script>
