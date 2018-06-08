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
        .notes-info {
            margin: .5em 0 1em;
            border-bottom: 1px dashed #ccc;
            font-size: .8em;
            color: #CDCECF;
            display:flex;
            justify-content:space-between;
            span {
                display: inline-block;
            }
        }
    }
}
.fav-btn {
    font-size: 1.5em;
    position: absolute;
    right: -.5em;
    top: -.5em;
}
.edit-btn {
    font-size: 1em;
    position: absolute;
    right: .8em;
    top: -.3em;
}
</style>
<template>
    <Layout>
        <article v-if="notes.data.length">
            <section>
                <ul class="notes-list">
                    <li class="notes-item" v-for="item in notes.data">
                        <Button class="fav-btn" type="text" icon="android-star-outline"></Button>
                        <Button class="edit-btn" type="text" icon="edit" v-if="item.canEdit"></Button>
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
        <article>
            <p class="notes-none">还没有任何笔记哦~ 快快点击右边的大按钮添加你的笔记吧！</p>
        </article>
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
        notesId: {
            type: String,
            default: ''
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
            }
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
        }
    },
    mounted () {
        this.queryNotes()
    },
    computed: {

    }
}
</script>
