const gulp = require('gulp')
const gutil = require('gulp-util')
const print = require('gulp-print')
const sequence = require('gulp-sequence')
const ghPages = require('gulp-gh-pages')

const config = require('./lib/config')

const tasks = [
  require('./lib/tasks/template-tasks'),
  require('./lib/tasks/release-tasks'),
  require('./lib/tasks/development-tasks')
]

tasks.forEach(service => service.load(gulp, config))

gulp.task('run', sequence(['watch', 'server']))

gulp.task('deploy', ['prod-build'], () => {
  gulp.src(config.get('buildGlob'))
  .pipe(ghPages({
    remoteUrl: 'git@github.com:anyhues/anyhues.github.io.git',
    branch: 'master'
  }).on('error', gutil.log))
  .pipe(print())
})
