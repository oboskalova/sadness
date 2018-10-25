import Vue from 'vue'
import FontSize from './FontSize'
import cssToObject from 'css-to-object'

export default class EditorHelper {
  static setupFun (editor, context) {
    init(editor, context)
    addButtons(editor, context)
  }

  static getOptions ({langPath, setupFun, extraFonts}) {
    let fontFormats = 'FuturaFuturisC=FuturaFuturisC;Roboto=Roboto;Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;'
    if (Array.isArray(extraFonts)) {
      extraFonts.forEach(info => {
        fontFormats += `${info.name}=${info.value};`
      })
    }
    let retObj = {
      menubar: false,
      height: 250,
      font_formats: fontFormats,
      fontsize_formats: '8px 9px 10px 11px 12px 14px 16px 18px 24px 36px 48px 60px 72px 96px',
      lineheight_formats: '1 1.5 2',
      content_css: '/static/css/tiny-mce-content.css',
      toolbar: EditorHelper.isToolbar
    }
    if (langPath) retObj.language_url = langPath
    if (setupFun) retObj.setup = (editor) => { setupFun(editor, this) }
    return retObj
  }

  static textToObject (html) {
    let root = createHtmlObject(html)
    _textToObjectRec(root, html.childNodes)
    return root
  }
}

function createHtmlObject (elem) {
  let tag = elem.nodeName.replace('#text', 'TEXT')
  let res = {}
  res.tag = tag
  if (tag === 'TEXT') res.text = elem.nodeValue
  if (elem.childNodes && tag !== 'TEXT' && tag !== 'BR') res.children = []
  if (elem.tagName && elem.hasAttribute('style')) {
    res.style = cssToObject(elem.getAttribute('style'), {
      camelCase: true,
      numbers: true
    })
  }
  return res
}

function _textToObjectRec (parent, children) {
  if (children.length) {
    children.forEach(child => {
      let childObj = createHtmlObject(child)
      parent.children.push(childObj)
      _textToObjectRec(childObj, child.childNodes)
    })
  }
}

EditorHelper.isToolbar = true

EditorHelper.toolbar1 = 'fontselect fontsize lineheight | forecolor backcolor | bold italic underline strikethrough | alignleft aligncenter alignright | outdent indent | wordshy _removeformat code'

EditorHelper.plugins = ['code, textcolor, colorpicker, paste']

let init = function (editor, context) {
  editor.on('init', () => {
    editor.formatter.register({
      lineheight: {inline: 'span', styles: {'line-height': '%value'}}
    })

    editor.formatter.register({
      wordbreak: {inline: 'span', styles: {'word-break': 'break-all'}}
    })

    editor.on('Paste', function (e) {
      editor.setContent(editor.getContent({format: 'html'}).replace(/class="[^"]*"/g, ''))
    })
  })
}

let addButtons = function (editor, context) {
  editor.addButton('lineheight', () => addLineHeightBtn(editor, context))
  editor.addButton('wordshy', () => addWordShyBtn(editor, context))
  editor.addButton('_removeformat', () => addRemoveFormatBtn(editor, context))
  editor.addButton('wordbreak', () => addWordBreakBtn(editor, context))
  editor.addButton('fontsize', () => addFontSizeBtn(editor, context))
}

function addLineHeightBtn (editor, context) {
  var items = []
  var defaultLineHeightFormats = '8pt 10pt 12pt 14pt 18pt 24pt 36pt'
  var lineheightFormats = editor.settings.lineheight_formats || defaultLineHeightFormats
  lineheightFormats.split(' ').forEach(function (item) {
    var text = item
    var value = item
    var values = item.split('=')
    if (values.length > 1) {
      text = values[0]
      value = values[1]
    }
    items.push({
      text: text,
      value: value
    })
  })
  return {
    type: 'listbox',
    // text: 'Интервал',
    id: 'LineHeightBtn',
    icon: 'icon mi mi-sort',
    tooltip: 'Междустрочный интервал',
    values: items,
    fixedWidth: true,
    onPostRender: function () {
      var self = this
      editor.on('nodeChange', function (e) {
        var formatName = 'lineheight'
        var formatter = editor.formatter
        var value = null
        e.parents.forEach(function (node) {
          items.forEach(function (item) {
            if (formatName) {
              if (formatter.matchNode(node, formatName, {
                value: item.value
              })) {
                value = item.value
              }
            } else {
              if (formatter.matchNode(node, item.value)) {
                value = item.value
              }
            }
            if (value) {
              return false
            }
          })
          if (value) {
            return false
          }
        })
        self.value(value)
      })
    },
    onselect: function (e) {
      editor.formatter.apply('lineheight', {
        value: this.value()
      })
      context.setText(editor.getContent())
    }
  }
}

function addFontSizeBtn (editor, context) {
  return {
    id: 'FontSize',
    tooltip: 'Размер текста',
    onpostrender: function () {
      editor.on('init', () => {
        /* eslint-disable no-new */
        new Vue({
          el: '#FontSize-button',
          render: h => h(FontSize, {
            props: { editor: editor }
          })
        })
      })
    }
  }
}

function addWordBreakBtn (editor, context) {
  return {
    icon: 'icon mi mi-wrap-text',
    id: 'WordBreakBtn',
    tooltip: 'Разрыв слов',
    onclick: function (e) {
      editor.formatter.toggle('wordbreak')
      context.setText(editor.getContent())
    },
    onpostrender: function () {
      var btn = this
      editor.on('init', function () {
        editor.formatter.formatChanged('wordbreak', function (state) {
          btn.active(state)
        })
      })
    }
  }
}

const createHyphenator = require('hyphen')
const hyphenationPatternsRu = require('../../../../../node_modules/hyphen/patterns/ru')

function addWordShyBtn (editor, context) {
  return {
    icon: 'icon mi mi-remove',
    id: 'WordShyBtn',
    tooltip: 'Перенос текста',
    onclick: function (e) {
      let selection = editor.selection.getContent({format: 'html'})
      console.log(editor.selection.getNode())
      let rootNode = editor.dom.getRoot()
      let selNode = editor.selection.getNode()
      let parSelNode = selNode.parentNode
      let conditionMore = (selNode === rootNode || parSelNode === rootNode)
      if (selection.indexOf('&shy;') !== -1) {
        let content = selection.replace(/&shy;/g, '')
        if (conditionMore) {
          editor.execCommand('mceInsertContent', false, content)
        } else {
          editor.setContent(editor.getContent({format: 'html'}).replace(selection, content))
        }
      } else {
        if (selection) {
          var hyphenate = createHyphenator(hyphenationPatternsRu, {hyphenChar: '&shy;'})
          let content = selection.replace(/&shy;/g, '')
          console.log(content)
          var hyphenatedText = hyphenate(content)
          console.log(hyphenatedText)
          if (conditionMore) {
            editor.execCommand('mceInsertContent', false, hyphenatedText)
          } else {
            editor.setContent(editor.getContent({format: 'html'}).replace(selection, hyphenatedText))
          }
        } else editor.execCommand('mceInsertContent', false, '&shy;')
      }
    },
    onPostRender: function () {
      var btn = this
      editor.on('NodeChange', function (e) {
        let selection = editor.selection.getContent()
        if (selection.indexOf('&shy;') !== -1) {
          btn.active(true)
        } else btn.active(false)
      })
    }
  }
}

function addRemoveFormatBtn (editor, context) {
  return {
    icon: 'removeformat',
    tooltip: 'Очистить формат',
    onclick: function (e) {
      editor.execCommand('removeformat')
      let oldContent = editor.selection.getContent({format: 'html'})
      let newContent = oldContent.replace(/<a.*>(.*)<\/a>/g, '$1')
      newContent = newContent.replace(/&shy;/g, '')
      // newContent = newContent.replace(/class=".*"/g, '')
      editor.execCommand('mceInsertContent', false, newContent)
    }
  }
}
