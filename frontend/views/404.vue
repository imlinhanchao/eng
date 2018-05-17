<style scoped lang="less">
.layout-404 {
    text-align: center;
    max-width: 300px;
    height: 300px;
    margin: auto;
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: transparent;
    img {
        width: 100%;
    }
}
</style>
<template>
    <div class="layout-404">
        <p><router-link to='/'><img src="../assets/error-404.png" alt=""></router-link></p>
        <p>找不到这个页面！<router-link to='/' style="border-bottom:1px dashed">返回首页</router-link></p>
    </div>
</template>
<script>
    import Cookies from 'js-cookie';
    export default {
        data() {
            return {

            };
        },
        computed: {
        },
        mounted() {
        },
        beforeDestroy() {
        },
        methods: {

        }
    };
</script>