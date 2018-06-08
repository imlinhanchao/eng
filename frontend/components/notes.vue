<style lang="less" scoped>
.notes-info {
    margin: 0 0 1em;
    border-bottom: 1px dashed #ccc;
}
.notes-list {
    list-style: none;
    .notes-item {
        position: relative;
    }
}
.fav-btn {
    font-size: 2em;
    position: absolute;
    right: 0;
}
</style>
<template>
    <Layout v-if="notes.data.length">
        <section>
            <ul class="notes-list">
                <li class="notes-item" v-for="item in notes.data">
                    <Button class="fav-btn" size="large" type="text" icon="android-star-outline"></Button>
                    <div class="notes-content markdown-preview" v-html="compiledMarkdown(item.content)"></div>
                    <p class="notes-info">{{item.createId}} in {{new Date(item.create_time * 1000).toLocaleString('zh-CN', {hour12: false})}}</p>
                </li>
            </ul>
        </section>
        <section>
            <Page :total="notes.total / count"></Page>
        </section>
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
