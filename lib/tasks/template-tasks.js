const pug = require('gulp-pug')
const plumber = require('gulp-plumber')
const print = require('gulp-print')
const del = require('del')
const watch = require('gulp-watch')
const markdownIt = require('jstransformer-markdown-it')

const assets = require('niehues-assets-dup')

const buildTemplates = (stream, config) => {
  return stream
  .pipe(plumber())
  .pipe(print((file) => `${file} changed, disting templates`))
  .pipe(pug({
    basedir: assets.templatePath,
    pretty: true,
    filters: [markdownIt],
    locals: Object.assign({}, assets.templateGlobals(config), { config })
  }))
}

module.exports = {}
module.exports.load = (gulp, config) => {
  gulp.task('clean-templates', () => del([`!${config.get('templateBuildPath')}`, config.get('templateBuildGlob')]))

  gulp.task('templates', ['clean-templates'], () =>
    buildTemplates(gulp.src(config.get('templateGlob')), config)
    .pipe(gulp.dest(config.get('templateBuildPath'))
  ))

  gulp.task('watch-templates', ['templates'], () => watch(config.get('templateWatchGlob'), () =>
    buildTemplates(gulp.src(config.get('templateGlob')), config).pipe(gulp.dest(config.get('templateBuildPath')))
  ))
}
