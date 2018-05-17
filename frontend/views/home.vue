<template>
    <Layout class="home">
        <Layout>
            <!-- <Select
                id="search"
                placeholder="搜索"
                v-model="word"
                filterable
                remote
                :remote-method="inputWord"
                :loading="loading">
                <Option v-for="(option, index) in words" :value="option" :key="index">{{option}}</Option>
            </Select> -->
            <Input v-model="word" name="word" placeholder="搜索" id="search" v-on:keyup.13="query">
                <Button slot="append" icon="ios-search" @click="query"></Button>
                <ul slot="append" class="input-tip" v-show="words.length > 0">
                    <li v-for="(w, index) in words" :key="index" @click="selectWord(w)">{{w}}</li>
                </ul>
            </Input>
        </Layout>
        <Layout v-show="dict.word">
            <h1>{{dict.word}}</h1>
            <p>
                [{{dict.pronunciation.AmE}}]
                <Button size="large" type="text" icon="volume-medium" @click="playSound(0)" class="sound-btn"></Button>
                <audio :src="dict.pronunciation.AmEmp3" class="sound" id="sound0"></audio>
            </p>
            <h2 class="sub-title">释义</h2>            
            <p>
                <ul class="def-list">
                    <li v-for="(def, index) in dict.defs" :key="index">
                        <span class="def-type">{{def.pos}}</span> 
                        <span class="def-mean">{{def.def}}</span>
                    </li>
                </ul>
            </p>
            <h2 class="sub-title">例句</h2>
            <section class="sam-section" v-for="(sam, index) in dict.sams" :key="index">
                <p class="sam-eng">
                    <span>{{sam.eng}}</span>
                    <Button size="large" type="text" icon="volume-medium" @click="playSound(index+1)" class="sound-btn"></Button>
                    <audio :src="sam.mp3Url" class="sound" :id="'sound' + (index + 1)"></audio>                    
                </p>
                <p class="sam-chn">{{sam.chn}}</p>
            </section>
        </Layout>
    </Layout>
</template>
<script>
    import axios from 'axios';
    import debounce from 'lodash/debounce';
    export default {
        components: {
        },
        mounted() {
            this.debouncedInputWord = debounce(this.inputWord, 500)
        },
        watch: {
            word: function (newQuestion, oldQuestion) {
                if (document.activeElement
                && document.activeElement.parentElement.id == 'search') 
                    this.debouncedInputWord()
                else console.log(document.activeElement)
            }
        },
        methods: {
            playSound(index) {
                let sound = document.getElementById(`sound${index}`);
                sound.pause();
                sound.play();
            },
            selectWord(word) {
                this.word = word;
                this.query();
            },
            inputWord() {
                if (this.word !== '') {
                    this.loading = true;
                    this.$axios.get(`/api/eng/input/${this.word}`)
                    .then((rsp) => {
                        rsp = rsp.data;
                        if (rsp.state == 0) {
                            this.loading = false;
                            this.words = rsp.data;
                        }
                    })
                    .catch((error) => {
                        this.$Message.error(error.message);
                        console.error(error.message);
                    });
                } else {
                    this.words = [];
                }
            },
            query () {
                this.words = [];
                let word = this.word;
                let numMat = word.match(/\d+/g);
                if (numMat && numMat.length == 2) word = numMat.join(',');
                this.$axios.get(`/api/eng/query/${word}`)
                .then((rsp) => {
                    rsp = rsp.data;
                    if (rsp.state == 0) {
                        if (numMat && numMat.length == 2) {
                            this.word = rsp.data;
                            this.query();
                        } else {
                            this.dict = rsp.data;
                            this.isShow = true;
                        }
                    } else {
                        this.$Message.error(rsp.msg);
                    }
                })
                .catch((error) => {
                    this.$Message.error(error.message);
                    console.error(error.message);
                });
            }
        },
        data() {
            return {
                word: '',
                words: [],
                loading: false,
                debouncedInputWord: null,   
                dict: {
                    word: '',
                    isSelf: false,
                    pronunciation: {
                        AmE: '',
                        AmEmp3: ''
                    },
                    defs: [],
                    sams: []
                }
            };
        }
    };
</script>
<style lang="less">
#search {
    max-width: 300px;
    margin: auto;
    position: relative;
}
.input-tip {
    position: absolute;
    left: 0;
    list-style: none;
    right: 43px;
    top: 29px;
    background: #FFF;
    padding: 6px 0;
    border-radius: 0 0 5px 5px;
    box-shadow: #CCC 1px 1px 1px;
    li {
        margin: 10px 7px;
        text-align: left;
        border-bottom: 1px dashed #C3C4C5;
        padding-bottom: 10px;
        cursor: pointer;
        &:last-child {
            border-bottom: 0;
            padding-bottom: 0;    
        }
    }
}
.home .sound-btn {
    &:focus {
        box-shadow: none;
    }
}
.def-list {
    list-style: none;
    .def-type {
        display: inline-block;
        background: #232425;
        text-align: center;
        width: 3em;
        margin: 2px 0;
        color: #FFF;
        font-weight: 700;
    }
}

h2.sub-title {
  margin: .5em 0 0;
  border-bottom: 1px solid #000;
}

.sam-section {
    margin:.5em 0;
    padding-bottom:.8em;
    border-bottom: 1px dashed #C2C3C4;
    &:last-child {
        padding-bottom:0;
        border-bottom: 0;
    }
    .sam-eng {
        font-weight:600;
    }
}
</style>