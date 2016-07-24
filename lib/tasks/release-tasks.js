 const print = require('gulp-print')
 const revReplace = require('gulp-rev-replace')
 const del = require('del')
 const sequence = require('gulp-sequence')
 const assets = require('niehues-assets')

 module.exports = {}
 module.exports.load = (gulp, config) => {
   const revisionFiles = () => config.get('env') === 'production'

   gulp.task('prod-templates', ['templates'], () => {
     let s = gulp.src(config.get('templateBuildGlob'))

     if (revisionFiles()) {
       const manifest = gulp.src(assets.revManifest)

       s = s
      .pipe(revReplace({manifest: manifest}))
      .pipe(print((file) => `${file} replacing revision references`))
     }

     return s.pipe(gulp.dest(config.get('templateDistPath')))
   })

   gulp.task('build', ['templates'], () => {
    // gulp.src(config.get('templateGlob'))
    // .pipe(gulp.dest(config.get('distPath')))
   })

   gulp.task('check-prod-mode', () => {
     if (config.get('env') !== 'production') throw new Error('production only task!')
   })

   gulp.task('clean-dist', () => del(config.get('distPath')))

   gulp.task('dist', (cb) => {
     sequence('check-prod-mode', 'clean-dist', 'prod-templates')(cb)
   })
 }
