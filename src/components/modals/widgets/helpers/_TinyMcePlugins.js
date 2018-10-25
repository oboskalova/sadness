import Vue from 'vue'
import FontSize from './FontSize'

const module = {}

module.init = function (editor, context) {
  editor.on('init', () => {
    // console.log(editor.editorContainer.children[0].children[0])
    editor.formatter.register({
      lineheight: {inline: 'span', styles: {'line-height': '%value'}}
    })

    editor.formatter.register({
      wordbreak: {inline: 'span', styles: {'word-break': 'break-all'}}
    })

    // editor.formatter.register({
    //   fontsize: {
    //     inline: 'span',
    //     toggle: false,
    //     styles: { fontSize: '%value' },
    //     clear_child_styles: true
    //   }
    // })

    editor.on('Paste', function (e) {
      // console.log('paste')
      // console.log(editor.getContent({format: 'html'}).replace(/class="[^"]*"/g, ''))
      editor.setContent(editor.getContent({format: 'html'}).replace(/class="[^"]*"/g, ''))
    })
  })
}

module.addButtons = function (editor, context) {
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

export default module
