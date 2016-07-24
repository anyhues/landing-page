const liveServer = require('live-server')
// `gulp-watch` is able to react for new files as well as deleted files,
// in contrast to `gulp.watch`

module.exports = {}
module.exports.load = (gulp, config) => {
  // local dev server
  gulp.task('server', (done) => {
    const serverConfig = {
      port: config.get('port'),
      host: config.get('host'),
      open: true,
      root: config.get('buildPath'),
      wait: 0,
      ignore: 'templates',
      watch: [ 'build' ]
    }

    liveServer.start(serverConfig)
    done()
  })

  // dev dist runner
  gulp.task('watch', ['watch-templates'])
}
