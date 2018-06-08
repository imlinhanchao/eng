
<style lang="less" scoped>
</style>
<template>
    <notes-list v-if="$store.getters.isLogin"
        :query="{
            favUserId: $store.getters.userInfo.id
        }"
        :order="[
            'word'
        ]"
        :title="'收藏的笔记'"
    ></notes-list>
</template>
<script>
    import notesList from '../components/notesList'
    export default {
        components: {
            notesList
        }
    };
</script>