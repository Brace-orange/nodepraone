import axios from 'axios'

const instance = axios.create({
  baseUrl: `http://${process.env.Host || 'localhost'}:${process.env.port || 3000}/`,
  timeout: 10000,
  headers: {

  }
})

export default instance