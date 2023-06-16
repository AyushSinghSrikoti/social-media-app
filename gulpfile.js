const gulp = require('gulp');
const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const rev = require('gulp-rev');
const uglify = require('gulp-uglify');
const del = require('del');



gulp.task('css', function() {
  console.log('minifying css....');
  
  gulp.src('./assets/css/**/*.css')
    .pipe(cssnano())
    .pipe(gulp.dest('./assets.css'));

  return gulp.src('./assets/**/*.css')
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
      cwd: 'public',
      merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
});

gulp.task('js', function(done){
  console.log('minifying js...');
   gulp.src('./assets/**/*.js')
  .pipe(uglify())
  .pipe(rev())
  .pipe(gulp.dest('./public/assets'))
  .pipe(rev.manifest({
      cwd: 'public',
      merge: true
  }))
  .pipe(gulp.dest('./public/assets'));
  done()
});

gulp.task('clean:assets', function(done){
  del.sync(['./public/assets'], { force:true });
  done();
});

gulp.task('build', gulp.series('clean:assets', 'css', 'js', function(done) {
  console.log('Building assets');
  done();
}));
