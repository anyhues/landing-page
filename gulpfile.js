const path = require('path')
const gulp = require('gulp')
const gutil = require('gulp-util')
const print = require('gulp-print')
const sequence = require('gulp-sequence')
const ghPages = require('gulp-gh-pages')
const sitemap = require('gulp-sitemap')

const assets = require('niehues-assets')

const config = require('./lib/config')
config.load(assets.configs[config.get('env')])
config.loadFile(path.resolve(__dirname, 'lib', 'environments', `${config.get('env')}.json`))

const tasks = [
  require('./lib/tasks/template-tasks'),
  require('./lib/tasks/release-tasks'),
  require('./lib/tasks/development-tasks')
]

tasks.forEach(service => service.load(gulp, config))

gulp.task('run', sequence(['watch', 'server']))

gulp.task('sitemap', () => {
  return gulp.src([`${config.get('distPath')}/**/*.html`, path.resolve(__dirname, 'sitemap-dummies/**/*')])
  .pipe(sitemap({
    siteUrl: config.get('homeHost')
  }))
  .pipe(gulp.dest(config.get('distPath')))
})

gulp.task('prod-build', sequence('dist', 'sitemap'))

gulp.task('deploy', ['prod-build'], () => {
  gulp.src([config.get('distGlob'), 'CNAME', 'robots.txt', assets.favIcon])
  .pipe(ghPages({
    remoteUrl: 'git@github.com:anyhues/anyhues.github.io.git',
    branch: 'master'
  }).on('error', gutil.log))
  .pipe(print())
})
