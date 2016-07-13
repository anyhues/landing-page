const image = require('gulp-image')
const del = require('del')
const watch = require('gulp-watch')

const buildImages = (stream, config) => {
  let s = stream

  if (config.get('featureImageOptimization')) {
    s = s.pipe(image())
  }

  return s
}

module.exports = {}
module.exports.load = (gulp, config) => {
  gulp.task('clean-images', () => del(config.get('imagesDistPath')))

  gulp.task('images', ['clean-images'], () => {
    return buildImages(gulp.src(config.get('imagesGlob')), config)
    .pipe(gulp.dest(config.get('imagesDistPath')))
  })

  gulp.task('watch-images', ['images'], () => buildImages(watch(config.get('imagesGlob')), config).pipe(gulp.dest(config.get('imagesDistPath'))))
}
