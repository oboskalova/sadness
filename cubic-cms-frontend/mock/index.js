/*
 *    Types:
 *      0 - Folder
 *      1 - Image
 *      2 - Video
 */

export default [{
  method: 'GET',
  url: '/api/folder/root',
  response: {
    parent: -1,
    content: [{
      id: 1,
      type: 0,
      name: 'Folder #1',
      thumbnail: 'https://devcubic.ru/static/img/folder.svg',
      createdAt: 'Tue Dec 21 2017 18:20:22 GMT+0300 (RTZ 2 (зима))',
      updatedAt: 'Tue Dec 24 2017 19:20:22 GMT+0300 (RTZ 2 (зима))'
    }, {
      id: 2,
      type: 0,
      name: 'Folder #2',
      thumbnail: 'https://devcubic.ru/static/img/folder.svg',
      createdAt: 'Tue Dec 21 2017 19:20:22 GMT+0300 (RTZ 2 (зима))',
      updatedAt: 'Tue Dec 24 2017 19:23:22 GMT+0300 (RTZ 2 (зима))'
    }, {
      id: 3,
      type: 1,
      name: 'Image #1',
      thumbnail: 'https://devcubic.ru/static/img/preview_image.jpg',
      createdAt: 'Tue Dec 21 2017 18:20:22 GMT+0300 (RTZ 2 (зима))',
      updatedAt: 'Tue Dec 24 2017 19:20:22 GMT+0300 (RTZ 2 (зима))'
    }, {
      id: 4,
      type: 2,
      name: 'Video #2',
      thumbnail: 'https://devcubic.ru/static/img/preview_video.jpg',
      createdAt: 'Tue Dec 21 2017 19:20:22 GMT+0300 (RTZ 2 (зима))',
      updatedAt: 'Tue Dec 24 2017 19:23:22 GMT+0300 (RTZ 2 (зима))'
    }]
  }
}, {
  method: 'GET',
  url: '/api/folder/1',
  response: {
    parent: 0,
    content: [{
      id: 5,
      type: 1,
      name: 'Image #2',
      thumbnail: 'https://devcubic.ru/static/img/preview_audio.jpg',
      createdAt: 'Tue Dec 21 2017 19:20:22 GMT+0300 (RTZ 2 (зима))',
      updatedAt: 'Tue Dec 24 2017 19:23:22 GMT+0300 (RTZ 2 (зима))'
    }]
  }
}, {
  method: 'POST',
  url: '/api/folder/',
  response: {
    id: 7,
    type: 0,
    name: 'New folder',
    thumbnail: 'https://devcubic.ru/static/img/folder.svg',
    createdAt: new Date().toString(),
    updatedAt: new Date().toString()
  }
}, {
  method: 'PUT',
  url: '/api/folder/1'
}, {
  method: 'PUT',
  url: '/api/folder/2/move/1'
}, {
  method: 'DELETE',
  url: '/api/folder/1'
}, {
  method: 'POST',
  url: '/api/file/',
  response: {
    id: 6,
    type: 2,
    name: 'New file',
    thumbnail: 'https://devcubic.ru/static/img/preview_image.jpg',
    createdAt: new Date().toString(),
    updatedAt: new Date().toString()
  }
}, {
  method: 'PUT',
  url: '/api/file/3'
}, {
  method: 'PUT',
  url: '/api/file/3/move/2'
}, {
  method: 'DELETE',
  url: '/api/file/3'
}, {
  method: 'DELETE',
  url: '/api/drive'
}]
