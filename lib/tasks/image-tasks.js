const image = require('gulp-image')
const del = require('del')
const watch = require('gulp-watch')
const print = require('gulp-print')

const buildImages = (stream, config) => {
  let s = stream
  if (config.get('featureImageOptimization')) {
    s = s
    .pipe(print((file) => `${file}: compressing image`))
    .pipe(image({
      pngquant: true,
      optipng: true,
      zopflipng: true,
      jpegRecompress: true,
      jpegoptim: true,
      mozjpeg: true,
      gifsicle: true,
      svgo: true
    }))
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
