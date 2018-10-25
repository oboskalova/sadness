/* eslint-disable */
import axios from 'axios'
import { baseUrl } from './config'

export const getApplications = () => {
  const result = {
    data: [
      {
        logo: 'https://assets.ubuntu.com/v1/8dd99b80-ubuntu-logo14.png',
        OSVersion: '4.4 и выше',
        date: '12.06.2017',
        appVersion: '1.26.176',
        url: '/kek'
      },
      {
        logo: 'https://assets.ubuntu.com/v1/8dd99b80-ubuntu-logo14.png',
        OSVersion: '5',
        date: '12.06.2018',
        appVersion: '1.26.176',
        url: '/kek'
      },
      {
        logo: 'https://assets.ubuntu.com/v1/8dd99b80-ubuntu-logo14.png',
        OSVersion: '4.4 и выше',
        date: '12.06.2019',
        appVersion: '1.26.176',
        url: '/kek'
      },
      {
        logo: 'https://assets.ubuntu.com/v1/8dd99b80-ubuntu-logo14.png',
        OSVersion: '4.4 и выше',
        date: '12.06.2020',
        appVersion: '5.0',
        url: '/kek'
      }
    ]
  }

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(result)
    }, 1000)
  })
}