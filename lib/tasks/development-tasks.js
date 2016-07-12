const liveServer = require('live-server')
// `gulp-watch` is able to react for new files as well as deleted files,
// in contrast to `gulp.watch`
const watch = require('gulp-watch')
const { buildStyles } = require('./style-tasks')
const { buildTemplates } = require('./template-tasks')

module.exports = {}
module.exports.load = (gulp, config) => {
  // local dev server
  gulp.task('server', (done) => {
    const serverConfig = {
      port: config.get('port'),
      host: config.get('host'),
      open: true,
      root: './dist',
      wait: 0,
      ignore: 'styles,templates',
      watch: [ 'dist' ]
    }

    liveServer.start(serverConfig)
    done()
  })

  // dev build runner
  gulp.task('watch-templates', () => buildTemplates(watch(config.get('templateGlob'))))
  gulp.task('watch-styles', () => watch(config.get('styleWatchGlob'), () => buildStyles(gulp.src(config.get('styleGlob')))))
  gulp.task('watch', ['watch-templates', 'watch-styles'])
}
