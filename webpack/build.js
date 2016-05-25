const _ = require('lodash')
const fs = require('fs')
const ora = require('ora')
const path = require('path')
const shell = require('shelljs')
const webpack = require('webpack')
const config = require('./config')
const webpackConfig = require('./webpack.conf')

console.log(
  '  提示：\n' +
  '  所有文件应当通过软链接输出到 Django 项目中，并保持合适的目录结构。\n' +
  '  启动 Django 访问网站。\n'
)

// 检查 dist 软链
const dist = path.resolve(config.ROOT, 'dist')
const distIsSymLink = fs.lstatSync(dist).isSymbolicLink()
if (!distIsSymLink) {
  console.error(`  [Error]\n  ${dist} 当前不是指向 Django 目录的软链，程序终止！\n`)
  process.exit(0)
}

// 清空输出文件夹并重建
const outputDirs = _.values(config.output)
shell.rm('-rf', outputDirs)
shell.mkdir('-p', outputDirs)

// 旋转图标
const spinner = ora('正在编译...')
spinner.start()

// Webpack 实例
const compiler = webpack(webpackConfig)
const compilerHandler = (err, stats) => {
  spinner.stop()
  if (err) throw err
  process.stdout.write(stats.toString({
    children: false,
    chunkModules: false,
    chunks: false,
    colors: true,
    modules: false,
    source: false
  }) + '\n\n')
  spinner.start()
}


// 开发模式下监控文件变动
if (config.DEBUG) {
  const watchOptions = {
    aggregateTimeout: 300,
    poll: true
  }
  compiler.watch(watchOptions, compilerHandler)
} else {
  compiler.run(compilerHandler)
}
