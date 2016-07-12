const print = require('gulp-print')
const rev = require('gulp-rev')
const revReplace = require('gulp-rev-replace')
const del = require('del')
const sequence = require('gulp-sequence')

module.exports = {}
module.exports.load = (gulp, config) => {
  const revisionFiles = () => config.get('env') === 'production'

  gulp.task('prod-assets', ['styles'], function () {
    return gulp.src([config.get('styleDistGlob')], { base: config.get('distPath') })
    .pipe(print((file) => `${file}: building revved version`))
    .pipe(rev())
    .pipe(gulp.dest(config.get('buildPath')))  // write rev'd assets to build dir
    .pipe(rev.manifest())
    .pipe(gulp.dest(config.get('styleBuildPath'))) // write manifest to build dir
  })

  gulp.task('prod-templates', ['templates'], () => {
    let s = gulp.src(config.get('templateDistGlob'))

    if (revisionFiles()) {
      const manifest = gulp.src(`${config.get('styleBuildPath')}/rev-manifest.json`)
      s = s
      .pipe(revReplace({manifest: manifest}))
      .pipe(print((file) => `${file} replacing revision references`))
    }

    return s.pipe(gulp.dest(config.get('templateBuildPath')))
  })

  gulp.task('build', ['templates', 'styles'], () => {
    gulp.src(config.get('templateGlob'))
    .pipe(gulp.dest(config.get('buildPath')))
  })

  gulp.task('prod-mode', (cb) => {
    config.set('env', 'production')
    cb()
  })

  gulp.task('dev-mode', (cb) => {
    config.set('env', 'development')
    cb()
  })

  gulp.task('clean-build', () => del(config.get('buildPath')))

  gulp.task('prod-build', (cb) => {
    sequence('clean-build', 'prod-mode', 'prod-assets', 'prod-templates', 'dev-mode')(cb)
  })
}
