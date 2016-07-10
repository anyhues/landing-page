// external dependencies
const gulp = require('gulp')
const pug = require('gulp-pug')
const liveServer = require('live-server')
const stylus = require('gulp-stylus')
const print = require('gulp-print')
// `gulp-watch` is able to react for new files as well as deleted files,
// in contrast to `gulp.watch`
const watch = require('gulp-watch')

// internal dependencies
const core = require('niehues-base')
const config = require('./lib/config')

const buildStyles = (stream) =>
  stream
  .pipe(print((file) => `${file} changed: build styles`))
  .pipe(stylus())
  .pipe(gulp.dest('./dist/css'))

const buildTemplates = (stream) =>
  stream
  .pipe(print((file) => `${file} changed: build template`))
  .pipe(pug({
    basedir: core.templatePath,
    pretty: true
  }))
  .pipe(gulp.dest('./dist/'))

gulp.task('styles', () => buildStyles(gulp.src(config.get('styleGlob'))))
gulp.task('templates', () => buildTemplates(gulp.src(config.get('templateGlob'))))

// local dev server
gulp.task('server', (done) => {
  const serverConfig = {
    port: config.get('port'),
    host: config.get('host'),
    open: true,
    root: './dist',
    wait: 1000
  }

  liveServer.start(serverConfig)
  done()
})

// dev build runner
gulp.task('watch-templates', () => buildTemplates(watch(config.get('templateGlob'))))
gulp.task('watch-styles', () => buildTemplates(watch(config.get('templateGlob'))))
gulp.task('watch', ['watch-templates', 'watch-styles'])

// development start script
gulp.task('run', ['server', 'watch'])

gulp.task('dev-build', ['templates', 'styles'])

gulp.task('build', ['dev-build'], () => {
  gulp.src('dist/**/*')
  .pipe(gulp.dest('build'))
})
