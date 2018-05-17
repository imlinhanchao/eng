<template>
    <router-view></router-view>
</template>
<script>
    import axios from 'axios';
    axios.defaults.withCredentials = true;
    export default {
        data() {
            return {
            };
        },
        mounted() {
        },
        beforeDestroy() {

        },
        methods: {

        },
        computed: {
        }
    };
</script>
<style lang="less" scoped>

</style>
