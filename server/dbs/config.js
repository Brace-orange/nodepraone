export default {
  dbs: 'mongodb://127.0.0.1:27017/shujuku',
  redis: {
    get host () {
      return '127.0.0.1'
    },
    get port () {
      return '6379'
    }
  },
  smtp: {
    get host () {
      return 'smtp.qq.com'
    },
    get user () {
      return '1261453120@qq.com'
    },
    get pass () {
      return 'poudarkrgflphfjd'
    },
    get code () {
      return () => {
        return Math.random.toString(16).slice(2, 6).toUpperCase()
      }
        // const code = Math.random.toString(16).slice(2, 6).toUpperCase()
        // return code
    },
    get expire () {
      return () => {
        new Date().getTime() + 60*60*1000
      }
      // const time = new Date().getTime() + 60*60*1000
      // return time
    }
  }
}