const print = require('gulp-print')
const plumber = require('gulp-plumber')
const stylus = require('gulp-stylus')
const autoprefixer = require('gulp-autoprefixer')
const sourcemaps = require('gulp-sourcemaps')
const del = require('del')
const watch = require('gulp-watch')

const buildStyles = (stream, config) => {
  let s = stream
  .pipe(print((file) => `${file} changed, building styles`))
  .pipe(plumber())

  s = config.get('featureSourceMaps') ? s.pipe(sourcemaps.init()) : s

  s = s.pipe(stylus({
    include: './node_modules',
    'include css': true
  }))

  s = config.get('featurePrefixStyles') ? s.pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false })) : s
  s = config.get('featureSourceMaps') ? s.pipe(sourcemaps.write()) : s
  return s
}

module.exports = {}
module.exports.load = (gulp, config) => {
  gulp.task('clean-styles', () => del(config.get('styleDistPath')))

  gulp.task('styles', ['clean-styles'], () =>
    buildStyles(gulp.src(config.get('styleGlob')), config)
    .pipe(gulp.dest(config.get('styleDistPath'))
  ))

  gulp.task('watch-styles', ['styles'], () => watch(config.get('styleWatchGlob'), () =>
    buildStyles(gulp.src(config.get('styleGlob')), config).pipe(gulp.dest(config.get('styleDistPath')))
  ))
}
