<template>
  <div>
    昵称：<input type="text" v-model="username"/>
    <br/>
    邮箱：<input type="text" v-model="email"/>
    <br/>
    <button @click="sendVertify(username, email)">{{vertifyText}}</button>
    <div v-if="statusMsg">{{statusMsg}}</div>
    <div>
      验证码：<input type="text" v-model="code"/>
    </div>
    <div>
      密码：<input type="text" v-model="password"/>
    </div>
    <div>
      再次确认密码：<input type="text" v-model="judgePassword"/>
    </div>
    <div>
      <button @click="onRegister(username, email, code, password, judgePassword)">同意并注册</button>
    </div>
    <div v-if="errmsg">{{errmsg}}</div>
  </div>
</template>
<script>
import Crypto from 'crypto-js'
export default {
  layout: 'blank',
  data () {
    return {
      vertifyText: '发送验证码',
      username: '1',
      email: '3073492730@qq.com',
      statusMsg: '',
      timerid: '',
      code: 'NCTI',
      password: '123456',
      judgePassword: '123456',
      errmsg: ''
    }
  },
  methods: {
    sendVertify(username, email) {
      if (username && email) {
        this.$axios.post('/users/vertify', {
          username: window.encodeURIComponent(username),
          email
          }).then(({
          status,
          data
        }) => {
          if (status === 200 && data && data.code === 0) {
            console.log(111)
            let count = 60
            const that = this
            this.vertifyText = `验证码已发送还剩${count--}`
            this.timerid = setInterval(function () {
              that.vertifyText = `验证码已发送还剩${count--}`
              // console.log(count)
              if (count < 0) {
                clearInterval(that.timerid)
                that.vertifyText = '发送验证码'
              }
            }, 1000)
          }else {
            this.statusMsg = data.msg
          }
        })
      }
    },
    onRegister(username, email, code, password, judgePassword) {
      if (password !== judgePassword) {
        alert('密码不一致')
        this.judgePassword = ''
        this.password = ''
        return false
      }
      this.$axios.post('/users/signup', {
        username: window.encodeURIComponent(username),
        email,
        code,
        password: Crypto.MD5(password).toString()
      }).then(({
        status,
        data
      }) => {
        if (status === 200) {
          if (data && data.code === 0) {
            window.location = '/login'
          } else {
          this.errmsg = data.msg
        }
        } else {
          this.errmsg = `服务器错误${status}`
          setTimeout(() => {
            this.errmsg = ''
          }, 1500);
        }
      })
    }
  }
}
</script>
<style scoped>
div {
  margin-top: 3px;
}
</style>