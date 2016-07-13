const imageOptimization = require('gulp-image-optimization')
const del = require('del')

module.exports = {}
module.exports.load = (gulp, config) => {
  gulp.task('clean-images', () => del(config.get('imagesDistPath')))

  gulp.task('images', ['clean-images'], () => {
    let s = gulp.src(config.get('imagesGlob'))

    if (!config.get('featureImageOptimization')) {
      s = s.pipe(imageOptimization({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
      }))
    }

    return s.pipe(gulp.dest(config.get('imagesDistPath')))
  })
}
