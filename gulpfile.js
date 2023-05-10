var gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
const cssbeautify = require('gulp-cssbeautify');
var beautify = require('gulp-beautify');

/*********************************LTR****************************************/

//npm config set legacy-peer-deps true
//_______ task for scss folder to css main style 
gulp.task('watch', function() {
    console.log('Command executed successfully compiling SCSS in assets.');
    return gulp.src('./src/assets/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write(''))
        .pipe(beautify.css({ indent_size: 4 }))
        .pipe(gulp.dest('./src/assets/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
})

gulp.task('default', gulp.series('watch'))