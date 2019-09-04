import Router from 'koa-router'
import Redis from 'koa-redis'
import nodeMailer from 'nodemailer'
import Email from '../dbs/config'
import Passport from './utils/passport'
import axios from './utils/axios'
import User from '../dbs/models/user'

let router = new Router({
  prefix: '/users'
})

let Store = new Redis().client

router.post('/signup', async (ctx) => {
  const {
    username,
    password,
    email,
    code,
  } = ctx.request.body

  console.log('enter--->singnup')
  if (code) {
    const saveCode = await Store.hget(`nodemail:${username}`, 'code')
    console.log(saveCode)
    const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
    console.log(saveExpire, '-->date')
    if (code === saveCode) {
      console.log('-->code same')
      if (new Date().getTime() - saveExpire > 0) {
        console.log('过期')
        ctx.body = {
          code: -1,
          msg: '验证码过期,请重新尝试'
        }
        // return false
      }
    } else {
      console.log('ma-->error')
      ctx.body = {
        code: -1,
        msg: '验证码填写错误'
      }
      // return false
    }
  } else {
    console.log('ma--->null')
    ctx.body = {
      code: -1,
      msg: '请填写验证码'
    }
    // return false
  }
  console.log('ggg')
  // let user = await User.find({
  //   username
  // })
  // console.log('eeeeeeee')
  // if (user.length) {
  //   console.log('ma --> yizhuce')
  //   ctx.body = {
  //     code: -1,
  //     msg: '已被注册'
  //   }
  //   return
  // }
  let nuser = User.create({
    username,
    password,
    email
  })
  console.log('-->before nuser')
  if (nuser) {
    console.log('-->nuser', nuser)
    let res = await axios.post('/users/signin', {username, password})
    if (res.data && res.code ===0) {
      ctx.body = {
        code: 0,
        msg: '注册成功',
        user: res.data.user
      }
    } else {
      ctx.body = {
        code: -1,
        msg: 'erroe'
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '注册失败'
    }
  }
})

router.post('/signin', async (ctx, next) => {
  return Passport.authenticate('local', function(err,user,info,status) {
    if (err) {
      ctx.boty = {
        code: -1,
        msg: err
      }
    } else {
      if (user) {
        ctx.boty = {
          code: 0,
          msg: '登录成功',
          user
        }
        return ctx.login(user)
      }else {
        ctx.boty = {
          code: -1,
          msg: info
        }
      }
    }
  })(ctx, next)
})

router.post('/vertify', async (ctx) => {
  console.log('进入vertify')
  let username = ctx.request.body.username
  const saveExpire = Store.hget(`nodemile:${username}`, 'expire')
  console.log(saveExpire, 'saveExpire')
  if (saveExpire && new Date().getTime() - saveExpire > 0) {
    ctx.body = {
      code: -1,
      msg: '验证码请求过于频繁,一分钟内一次',
    }
    return false
  }
  let transporter = nodeMailer.createTransport({
    host: Email.smtp.host,
    port: 587,
    secure: false,
    auth: {
      user: Email.smtp.user,
      pass: Email.smtp.pass
    }
  })
  let ko = {
    code: Email.smtp.code,
    expire: Email.smtp.expire,
    email: ctx.request.body.email,
    user: ctx.request.body.username,
  }
  let mailOptions = {
    from: `认证邮件<${Email.smtp.user}>`,
    to: ko.email,
    subject: 'zheshizhuti',
    html: `<h2></bt>yanzhengma ${ko.code}</h2>`
  }
  await transporter.sendMail(mailOptions, (error, info) => {
    console.log('开始发邮件')
    if(error) {
      console.log(error)
    }else {
      Store.hmset(`nodemail:${ko.user}`, 'code', ko.code, 'expire', ko.expire, 'email', ko.email)
    }
  })
  ctx.body = {
    code: 0,
    msg: '验证码已发送',
  }
})

router.get('/exit', async (ctx, next) => {
  await ctx.logout()
  if(!ctx.isAuthenticated()) {
    ctx.body = {
      code: 0,
    }
  } else {
    ctx.body = {
      code: -1,
    }
  }
})

router.get('/getUser', async (ctx, next) => {
  if(ctx.isAuthenticated()) {
    const {
      username,
      email
    } = ctx.session.passport.user
    ctx.body = {
      user: username,
      email,
    }
  }else {
    ctx.body = {
      user: '',
      email: '',
  }
}
})

export default router