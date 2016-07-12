const gulp = require('gulp')
const config = require('./lib/config')

const tasks = [
  require('./lib/tasks/style-tasks'),
  require('./lib/tasks/template-tasks'),
  require('./lib/tasks/release-tasks'),
  require('./lib/tasks/development-tasks')
]

tasks.forEach(service => service.load(gulp, config))

gulp.task('run', ['server', 'watch'])

gulp.task('deploy', ['prod-build'], () => {
  gulp.src('dist/**/*')
  .pipe(gulp.dest('build'))
})
