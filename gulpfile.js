var gulp = require('gulp'),
    wiredep      = require('wiredep').stream,
    useref       = require('gulp-useref'),
    concatCSS    = require('gulp-concat-css'),
    autoprefixer = require('gulp-autoprefixer'),
    rename       = require('gulp-rename'),
    minifyCSS    = require('gulp-minify-css'),
    livereload   = require('gulp-livereload'),
    notify       = require('gulp-notify'),
    less         = require('gulp-less'),
    uncss        = require('gulp-uncss'),
    connect      = require('gulp-connect'),
    gulpif       = require('gulp-if'),
    uglify       = require('gulp-uglify'),
    minifyHTML   = require('gulp-minify-html'),
    imagemin     = require('gulp-imagemin'),
    jade         = require('gulp-jade'),
    clean        = require('gulp-clean');

//bower-wtrdep подключаем библиотеки
gulp.task('bower', function () {
  gulp.src('./app/index.html')
    .pipe(wiredep({
      directory : "app/components"
    }))
    .pipe(gulp.dest('app'));
});

//connect поднимаем сервак
gulp.task('connect', function() {
  connect.server({
    root: 'app',
    livereload: true
  });
});

//clean
gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

//uncss - убираем все что не используеться
gulp.task('un_css', function() {
    return gulp.src('app/css/style.css')
        .pipe(uncss({
            html: ['app/index.html']
        }))
        .pipe(gulp.dest('app/css'));
});

//uncss bootstrap - убираем все что не используеться
gulp.task('un_css_bootstrap', function() {
    return gulp.src('app/css/bootstrap.css')
        .pipe(uncss({
            html: ['app/index.html']
        }))
        .pipe(gulp.dest('app/css'));
});

// Jade компилируем
gulp.task('jade', function(){
  gulp.src(['template/*.jade','!template/_*.jade'])
    .pipe(jade({
        pretty: true
    }))
    .pipe(gulp.dest('app/'))
    .pipe(connect.reload())
    .pipe(notify('Jade Done!'));
});

//less компилируем
gulp.task('less', function () {
  gulp.src('less/main.less')
    .pipe(less())
    .pipe(autoprefixer('last 2 versions', '> 1%', 'ie 9'))
    .pipe(gulp.dest('app/css/'))
    .pipe(connect.reload())
    .pipe(notify('CSS Done!'));
});

//less_bootstrap компилируем
gulp.task('less_bootstrap', function () {
  gulp.src('app/components/bootstrap/less/bootstrap.less')
    .pipe(less())
    .pipe(gulp.dest('app/css/'))
    .pipe(notify('Bootstrap Done!'));
});

//html
gulp.task('html', function () {
    gulp.src('app/index.html')
        .pipe(connect.reload())
        .pipe(notify('Html Done!'));
});

gulp.task('js', function () {
    gulp.src('app/js/*.js')
        .pipe(connect.reload())
        .pipe(notify('JS Done!'));
});

// wath
gulp.task('watch', function () {
    gulp.watch('less/**/*.less', ['less'])
    gulp.watch('template/**/*.jade',['jade'])
});

// image compress
gulp.task('compress', function() {
  gulp.src('app/img/**/*')
  .pipe(imagemin())
  .pipe(gulp.dest('dist/img'))
});

//build
gulp.task('build', ['clean', 'un_css', 'compress'], function () {
    var assets = useref.assets(),
        opts = {
            conditionals: true,
            spare:true
        };

    return gulp.src('app/*.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCSS()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulpif('*.html', minifyHTML(opts)))
        .pipe(gulp.dest('dist'));
});

// dev task
gulp.task('dev', ['connect', 'jade', 'less_bootstrap', 'less', 'js', 'watch']);