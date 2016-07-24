const print = require('gulp-print')
const revReplace = require('gulp-rev-replace')
const del = require('del')
const sequence = require('gulp-sequence')

module.exports = {}
module.exports.load = (gulp, config) => {
  const revisionFiles = () => config.get('env') === 'production'

  gulp.task('prod-templates', ['templates'], () => {
    let s = gulp.src(config.get('templateDistGlob'))

    if (revisionFiles()) {
      const manifest = gulp.src(config.get('manifestPath'))
      s = s
      .pipe(revReplace({manifest: manifest}))
      .pipe(print((file) => `${file} replacing revision references`))
    }

    return s.pipe(gulp.dest(config.get('templateBuildPath')))
  })

  gulp.task('build', ['templates'], () => {
    // gulp.src(config.get('templateGlob'))
    // .pipe(gulp.dest(config.get('buildPath')))
  })

  gulp.task('check-prod-mode', () => {
    if (config.get('env') !== 'production') throw new Error('production only task!')
  })

  gulp.task('clean-build', () => del(config.get('buildPath')))

  gulp.task('prod-build', (cb) => {
    sequence('check-prod-mode', 'clean-build', 'vendor-assets', 'rev-assets', 'prod-templates', 'prod-fonts')(cb)
  })
}
