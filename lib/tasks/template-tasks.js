const pug = require('gulp-pug')
const plumber = require('gulp-plumber')
const print = require('gulp-print')
const del = require('del')

const core = require('niehues-core')

const buildTemplates = (stream) => {
  return stream
  .pipe(plumber())
  .pipe(print((file) => `${file} changed, building templates`))
  .pipe(pug({ basedir: core.templatePath, pretty: true }))
}

module.exports = {}
module.exports.load = (gulp, config) => {
  gulp.task('clean-templates', () => del([`!${config.get('templateDistPath')}`, config.get('templateDistGlob')]))
  gulp.task('templates', ['clean-templates'], () =>
    buildTemplates(gulp.src(config.get('templateGlob')))
    .pipe(gulp.dest(config.get('templateDistPath'))
  ))
}

module.exports.buildTemplates = buildTemplates
