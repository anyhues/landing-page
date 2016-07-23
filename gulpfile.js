const gulp = require('gulp')
const sequence = require('gulp-sequence')
const config = require('./lib/config')

const tasks = [
  require('./lib/tasks/image-tasks'),
  require('./lib/tasks/style-tasks'),
  require('./lib/tasks/font-tasks'),
  require('./lib/tasks/template-tasks'),
  require('./lib/tasks/release-tasks'),
  require('./lib/tasks/development-tasks')
]

tasks.forEach(service => service.load(gulp, config))

gulp.task('run', sequence(['watch', 'server']))

gulp.task('deploy', ['prod-build'], () => {
  gulp.src(config.get('distGlob'))
  .pipe(gulp.dest(config.get('buildPath')))
})
