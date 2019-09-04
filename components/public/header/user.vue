<template>
    <div class="m-user">
        <template v-if="user">
            欢迎你，<span>{{user}}</span>
            <nuxt-link to="/exit">推出</nuxt-link>
        </template>
        <template v-else>
            <nuxt-link to="/login">立即登录</nuxt-link>
            <nuxt-link to="register">注册</nuxt-link>
        </template>
    </div>
</template>
<script>
export default {
    data () {
        return {
            user: ''
        }
    }
}
</script>