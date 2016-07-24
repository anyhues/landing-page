const del = require('del')
const watch = require('gulp-watch')

module.exports = {}
module.exports.load = (gulp, config) => {
  gulp.task('clean-fonts', () => del(config.get('fontDistPath')))

  gulp.task('fonts', ['clean-fonts'], () => {
    return gulp.src([config.get('fontGlob'), 'node_modules/ionicons/dist/fonts/**/*'])
    .pipe(gulp.dest(config.get('fontDistPath')))
  })

  gulp.task('watch-fonts', ['fonts'], () => watch(config.get('fontGlob')).pipe(gulp.dest(config.get('fontDistPath'))))
}
