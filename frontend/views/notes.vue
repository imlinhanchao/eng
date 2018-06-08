
<style lang="less" scoped>
</style>
<template>
    <notes-list v-if="$store.getters.isLogin"
        :query="{
            createId: $store.getters.userInfo.id
        }"
        :order="[
        ]"
        :title="'我的笔记'"
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