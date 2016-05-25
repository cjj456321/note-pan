// see http://vuejs-templates.github.io/webpack for documentation.
const path = require('path')

const ROOT = path.resolve(__dirname, '../')

module.exports = {
  ROOT,
  DEBUG: process.env.NODE_ENV !== 'production',
  input: {
    static: ROOT + '/static/', // 这里末尾必须是 /
    src: path.resolve(ROOT, 'src'),
    indexTpl: path.resolve(ROOT, 'index.html')
  },
  output: {
    css: path.resolve(ROOT, 'dist/static/duobao/v2/css'),
    img: path.resolve(ROOT, 'dist/static/duobao/v2/img'),
    js: path.resolve(ROOT, 'dist/static/duobao/v2/js'),
    tpl: path.resolve(ROOT, 'dist/templates/duobao/v2')
  }
}
