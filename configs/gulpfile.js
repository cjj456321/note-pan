const gulp = require('gulp')
const babel = require('gulp-babel')
const browserSync = require('browser-sync').create()
const sass = require('gulp-sass')
const gulpJade = require('gulp-jade')
const jade = require('jade')

gulp.task('default', ['html', 'js', 'css', 'browsersync'])

gulp.task('js', () => {
  gulp.src('src/*.js')
    .pipe(babel({
      presets: ['es2015', 'stage-2']
    })).on('error', (err) => console.error('Error', err.message))
    .pipe(gulp.dest('dist/'))
})

gulp.task('html', () => {
  gulp.src('src/*.jade')
    .pipe(gulpJade({
      jade: jade,
      pretty: true
    })).on('error', (e) => console.log(e.message))
    .pipe(gulp.dest('dist/'))
})

gulp.task('css', () => {
  gulp.src('./src/*.scss')
    .pipe(sass()).on('error', (err) => console.error(err.message))
    .pipe(gulp.dest('./dist/'))
    .pipe(browserSync.stream())
})

gulp.task('browsersync', () => {
  browserSync.init({
    server: {
      baseDir: './dist/'
    }
  })
  gulp.watch('src/*.jade', ['html']).on('change', browserSync.reload)
  gulp.watch('src/*.js', ['js']).on('change', browserSync.reload)
  gulp.watch('src/*.scss', ['css']).on('change', browserSync.reload)
})
