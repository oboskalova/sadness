import * as opentype from 'opentype.js'

export const createFontElement = (file, fileType) => {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      let fontFormat = ''
      switch (fileType) {
        case 'otf': fontFormat = 'opentype'; break
        case 'ttf': fontFormat = 'truetype'; break
        case 'woff': fontFormat = 'woff'; break
        case 'woff2': fontFormat = 'woff2'; break
      }

      let fileName = file.name.split('.')
      fileName.pop()
      fileName = fileName.join('.')

      const newStyle = document.createElement('style')
      newStyle.id = 'FontsLoaderExampleFont'
      newStyle.appendChild(document.createTextNode(`
      @font-face {
          font-family: "FontsLoaderExampleFont";\
          src: url("${reader.result}") format('${fontFormat}');\
      }`))
      resolve(newStyle)
    }
  })
}

export const getFontUrl = file => {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      resolve(reader.result)
    }
  })
}

export const loadFont = async url => {
  return new Promise((resolve, reject) => {
    opentype.load(url, (err, font) => {
      if (err) {
        reject(err)
      } else {
        resolve(font)
      }
    })
  })
}

export const validateFont = async fontFile => {
  return new Promise(async resolve => {
    const types = ['otf', 'woff', 'woff2', 'ttf']
    const fontFileType = fontFile.name.split('.').pop()

    if (types.includes(fontFileType)) {
      const fontUrl = await getFontUrl(fontFile)
      const font = await loadFont(fontUrl)
      const fontFamily = font.names.fontFamily.en
      const glyph = font.charToGlyph('я')
      const path = glyph.getPath()

      const elementCreating = createFontElement(fontFile, fontFileType)

      elementCreating.then(el => {
        document.head.appendChild(el)
      })

      if (glyph.name === '.notdef' || path.commands.length === 0) {
        resolve({
          fontFamily,
          errorMessage: 'Шрифт не содержит кириллических букв!'
        })
      }
      resolve({ fontFamily })
    } else {
      resolve({
        errorMessage: `Вы можете загружать только файлы в следующих форматах: ${types.join(', ')}`
      })
    }
  })
}
