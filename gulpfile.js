// external dependencies
const gulp = require('gulp')
const gutil = require('gulp-util')
const pug = require('gulp-pug')
const liveServer = require('live-server')
const stylus = require('gulp-stylus')
const print = require('gulp-print')
const plumber = require('gulp-plumber')
const sequence = require('gulp-sequence')
const del = require('del')

// asset addons
const autoprefixer = require('gulp-autoprefixer')
const sourcemaps = require('gulp-sourcemaps')
const rev = require('gulp-rev')
const revReplace = require('gulp-rev-replace')

// `gulp-watch` is able to react for new files as well as deleted files,
// in contrast to `gulp.watch`
const watch = require('gulp-watch')

// internal dependencies
const core = require('niehues-core')
const config = require('./lib/config')

const revisionFiles = () => config.get('env') === 'production'
const prefixStyles = () => true
const createSourceMaps = () => config.get('env') === 'development'

const buildStyles = (stream) => {
  const withSourceMaps = createSourceMaps()

  return del(config.get('styleDistPath'))
  .then(() => stream)
  .then(stream => stream.pipe(plumber()))
  .then(stream => stream.pipe(print((file) => `${file} changed: build styles`)))
  .then(stream => {
    if (withSourceMaps) return stream.pipe(sourcemaps.init())
    return stream
  })
  .then(stream => stream.pipe(stylus()))
  .then(stream => {
    if (prefixStyles()) {
      return stream.pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
    }
    return stream
  })
  .then(stream => {
    if (withSourceMaps) return stream.pipe(sourcemaps.write())
    return stream
  })
  .then(stream => stream.pipe(gulp.dest(config.get('styleDistPath'))))
}

const buildTemplates = (stream, options = {}) => {
  return del([`!${config.get('templateDistPath')}`, config.get('templateDistGlob')])
  .then(() => stream)
  .then(stream => stream.pipe(plumber()))
  .then(stream => stream.pipe(print((file) => `${file} changed: build template`)))
  .then(stream => stream.pipe(pug({ basedir: core.templatePath, pretty: true })))
  .then(stream => {
    if (revisionFiles()) {
      gutil.log(`${config.get('env')} mode: reference revisioned files`)
      // sync file lookup of the in asset step generated manifest
      const manifest = gulp.src(`${config.get('distPath')}/rev-manifest.json`)
      return stream.pipe(revReplace({manifest: manifest}))
    }
    return stream
  })
  .then(stream => stream.pipe(gulp.dest(config.get('templateDistPath'))))
}

gulp.task('styles', () => buildStyles(gulp.src(config.get('styleGlob'))))
gulp.task('templates', () => buildTemplates(gulp.src(config.get('templateGlob'))))

gulp.task('prod-templates', () =>
  buildTemplates(gulp.src(config.get('templateGlob'), { revved: true })))

gulp.task('prod-assets', ['styles'], function () {
  return gulp.src([config.get('styleDistGlob')], {base: config.get('distPath')})
    .pipe(rev())
    .pipe(gulp.dest(config.get('distPath')))  // write rev'd assets to build dir
    .pipe(rev.manifest())
    .pipe(gulp.dest(config.get('distPath'))) // write manifest to build dir
})

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

gulp.task('prod-mode', (cb) => {
  config.set('env', 'production')
  cb()
})

gulp.task('dev-mode', (cb) => {
  config.set('env', 'development')
  cb()
})

gulp.task('collect-release', () =>
  gulp.src(config.get('distGlob')).pipe(gulp.dest(config.get('buildPath'))))

gulp.task('prod-build', (cb) => {
  sequence('prod-mode', 'prod-assets', 'prod-templates', 'collect-release', 'dev-mode')(cb)
})

gulp.task('deploy', ['prod-build'], () => {
  gulp.src('dist/**/*')
  .pipe(gulp.dest('build'))
})
