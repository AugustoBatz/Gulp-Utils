const { src, dest, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const minifycss = require('gulp-minify-css');
const sass = require('gulp-sass');

function helloWorldTask(done) {
    console.log("hello world");
    done();
}

const files = {
    scssPath: 'src/scss/**/*.scss',
    distCssPath: 'dist/css',
    indexPath: 'dist/index.html',
    buildPathCss: 'build/css',
    srcJsPath: 'src/js/**/*.js',
    distJsPah: 'dist/js',
}

/** 
 * Task for build styles
 * 
*/
function scssTask() {
    console.log("start sccs Task");
    return src(files.scssPath)
        .pipe(sass())
        .pipe(dest(files.distCssPath))
}


/**
 *  Observer file change
 */
function watchScssTask() {
    console.log("start watch task");
    watch(
        [files.scssPath, files.indexPath],
        series(scssTask, reloadTask)
    )
}

function serverTask(d) {
    browserSync.init({
        server: {
            baseDir: './dist/'
        }
    });
    d();
}

function reloadTask(d) {
    browserSync.reload();
}


function minifyCssTask() {
    return src(files.distCssPath + '/*.css')
        .pipe(concat('style.css'))
        .pipe(minifycss())
        .pipe(dest('dist/css/build/'))

}

function minifyJsTask() {
    return src('src/js/*.js')
        .pipe(concat('action.js'))
        .pipe(uglify())
        .pipe(dest('dist/js/'))
}

exports.css = series(scssTask, minifyCssTask, minifyJsTask, serverTask, watchScssTask);