const gulp = require('gulp')
const pug = require('gulp-pug')
// const replace = require('gulp-replace')
const core = require('niehues-base')

gulp.task('templates', () => {
  gulp.src('./templates/[^_]*.pug')
  .pipe(pug({
    basedir: core.templatePath,
    pretty: true
  }))
  .pipe(gulp.dest('./dist/'))
})

gulp.task('build', ['templates'])
