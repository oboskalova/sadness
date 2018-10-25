import {getFonts} from '../../api/fonts'
import lodash from 'lodash'

function getFontIds (fonts) {
  let organFontIds = []
  fonts.forEach(font => {
    organFontIds.push(font.id)
  })
  organFontIds.sort()
  return organFontIds
}

export const getFontsInfo = async () => {
  let fonts = await getFonts()
  let fontsInfo = []
  fonts.forEach(font => {
    fontsInfo.push({name: font.name, value: 'organFont' + font.id})
  })
  return fontsInfo
}

export const removeFontsOnPage = () => {
  if (window.organFontIds) window.organFontIds = undefined
  const fontsStyle = document.getElementById('organ-fonts')
  if (fontsStyle && fontsStyle.parentNode) {
    fontsStyle.parentNode.removeChild(fontsStyle)
  }
}

export const addFontsOnPage = async () => {
  if (!window.organFontIds) window.organFontIds = []
  let fonts = await getFonts()
  let oldFontsStyle = document.getElementById('organ-fonts')
  let curOrganFontsIds = getFontIds(fonts)
  console.log('old ', window.organFontIds)
  console.log('new ', curOrganFontsIds)
  console.log(getFontIds(fonts))
  let isReload = !lodash.isEqual(window.organFontIds, curOrganFontsIds)
  window.organFontIds = lodash.cloneDeep(curOrganFontsIds)
  if (!isReload && oldFontsStyle) {
    console.log('no changes return')
    return
  } else if (oldFontsStyle) {
    console.log('remove fonts on page')
    removeFontsOnPage()
  }
  let fontStyle = document.createElement('style')
  console.log('fontStyle', fontStyle)
  fontStyle.id = 'organ-fonts'
  if (Array.isArray(fonts)) {
    for (let i = 0; i < fonts.length; i++) {
      let font = fonts[i]
      let fontName = 'organFont' + font.id
      let fontUrl = font.url
      let fontNode = document.createTextNode(`
      @font-face {
          font-family: "${fontName}";\
          src: url("${fontUrl}");\
      }`)
      fontStyle.appendChild(fontNode)
    }
  }
  document.head.appendChild(fontStyle)
}
