const gulp = require('gulp')
const config = require('./lib/config')

const styleTasks = require('./lib/tasks/style-tasks')
const templateTasks = require('./lib/tasks/template-tasks')
const releaseTasks = require('./lib/tasks/release-tasks')
const developmentTasks = require('./lib/tasks/development-tasks')
const tasks = [
  styleTasks,
  templateTasks,
  releaseTasks,
  developmentTasks
]

tasks.forEach(service => service.load(gulp, config))

gulp.task('run', ['server', 'watch'])

gulp.task('deploy', ['prod-build'], () => {
  gulp.src('dist/**/*')
  .pipe(gulp.dest('build'))
})
