import axios from 'axios'

export default class Instagram {
  constructor () {
    this.clientId = '57cf934cdccd408496f24d794b61f584'
  }

  get axiosInstance () {
    const instance = axios.create({
      transformRequest: [
        (data, headers) => {
          delete headers.common.Authorization
          return data
        }
      ]
    })
    return instance
  }

  get token () {
    return localStorage.getItem('instagram_token')
    // return '4129946691.3ca024a.b5f4295dbf5e4fdf86b57754df9f4b68'
  }

  clearToken () {
    localStorage.setItem('instagram_token', 'null')
  }

  get isToken () {
    return this.token && this.token !== 'null'
  }

  doAuth (redirectUri) {
    window.open('https://www.instagram.com/oauth/authorize/?client_id=' + this.clientId +
        '&redirect_uri=' + redirectUri + '&response_type=token' +
        '&scope=basic+public_content+follower_list')
    return Promise.resolve()
  }

  createInstaPost (dataPost) {
    const user = dataPost.user
    const caption = dataPost.caption
    let post = {
      'username': user.username,
      'profileImg': user.profile_picture,
      'text': caption ? caption.text : '',
      'type': dataPost.type
    }
    if (post.type === 'image' || post.type === 'video') {
      post.link = dataPost.images.standard_resolution.url
    }
    return post
  }

  apiSelfMedia ({ token }) {
    return new Promise((resolve, reject) => {
      let url = 'https://api.instagram.com/v1/users/self/media/recent/?access_token=' + token
      this.axiosInstance.get(url)
        .then(res => {
          let data = res.data
          // console.log(data.data[0])
          if (data.meta.code !== 200) {
            reject(new Error('Cant get start data from Instagram'))
          } else {
            let resArr = []
            console.log(data.data)
            for (let dataPost of data.data) {
              let post = this.createInstaPost(dataPost)
              // console.log('------------------------>')
              // console.log(post)
              resArr.push(post)
            }
            resolve(resArr)
          }
        })
    })
  }

  apiTagMedia ({ token, hashtag }) {
    return new Promise((resolve, reject) => {
      if (!hashtag) reject(new Error('tagName necessary parameter'))
      let url = 'https://api.instagram.com/v1/tags/' + hashtag + '/media/recent?access_token=' + token
      this.axiosInstance.get(url)
        .then(res => {
          let data = res.data
          // console.log(data.data[0])
          if (data.meta.code !== 200) {
            reject(new Error('Cant get start data from Instagram'))
          } else {
            let resArr = []
            console.log(data.data)
            for (let dataPost of data.data) {
              let post = this.createInstaPost(dataPost)
              // console.log('------------------------>')
              // console.log(post)
              resArr.push(post)
            }
            resolve(resArr)
          }
        })
    })
  }
}
