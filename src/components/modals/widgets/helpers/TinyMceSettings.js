const module = {}

module.toolbar1 = 'fontselect fontsize lineheight | forecolor backcolor | bold italic underline strikethrough | alignleft aligncenter alignright | outdent indent | wordshy _removeformat code'

module.plugins = ['code, textcolor, colorpicker, paste']

module.getOptions = ({langPath, setupFun}) => {
  let retObj = {
    menubar: false,
    height: 250,
    font_formats: 'Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;',
    fontsize_formats: '8px 9px 10px 11px 12px 14px 16px 18px 24px 36px 48px 60px 72px 96px',
    lineheight_formats: '1 1.5 2',
    content_css: '/static/css/tiny-mce-content.css'
  }
  if (langPath) retObj.language_url = langPath
  if (setupFun) retObj.setup = (editor) => { setupFun(editor, this) }
  return retObj
}

export default module
