var gulp = require('gulp');
var inject = require('gulp-inject');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var series = require('stream-series');
var bowerFiles = require('main-bower-files');
var filter = require('gulp-filter');
var uglifycss = require('gulp-uglifycss');
var urlAdjuster = require('gulp-css-url-adjuster');
var angularFilesort = require('gulp-angular-filesort');
var ngAnnotate = require('gulp-ng-annotate');
var sourcemaps = require('gulp-sourcemaps');
var identity = require('gulp-identity');

const srcDir = "./src/main/javascript/";
const destDir = "./src/main/resources/static/";

gulp.task('default', function () {
    return build(true);
});

gulp.task('production', function () {
    return build(false);
});

function build(debug) {
    if (debug) {
        uglifycss = identity;
        uglify = identity;
    } else {
        sourcemaps.init = identity;
        sourcemaps.write = identity;
    }

    var vendorFonts = gulp.src(bowerFiles())
        .pipe(filter([
            '**/*.eot',
            '**/*.svg',
            '**/*.ttf',
            '**/*.woff',
            '**/*.woff2'
        ]))
        .pipe(gulp.dest(destDir + "fonts"));

    var vendorCss = gulp.src(bowerFiles())
        .pipe(sourcemaps.init())
        .pipe(filter('**/*.css'))
        .pipe(urlAdjuster({
            replace:  ['../fonts/','/fonts/'],
        }))
        .pipe(uglifycss())
        .pipe(concat('vendor.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(destDir));

    var sourceCss = gulp.src(srcDir + '**/*.css')
        .pipe(sourcemaps.init())
        .pipe(uglifycss())
        .pipe(concat('app.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(destDir));

    var vendorJs = gulp.src(bowerFiles())
        .pipe(sourcemaps.init())
        .pipe(filter('**/*.js'))
        .pipe(uglify({preserveComments: 'license'}))
        .pipe(concat('vendor.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(destDir));

    var sourceJs = gulp.src([srcDir + '**/*.js'])
        .pipe(sourcemaps.init())
        .pipe(angularFilesort())
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(destDir));

    return gulp.src(srcDir + 'index.html')
        .pipe(inject(vendorCss, {name: 'bower', ignorePath: "src/main/resources/static"}))
        .pipe(inject(sourceCss, {ignorePath: "src/main/resources/static"}))
        .pipe(inject(vendorJs, {name: 'bower', ignorePath: "src/main/resources/static"}))
        .pipe(inject(sourceJs, {ignorePath: "src/main/resources/static"}))
        .pipe(gulp.dest(destDir));
}
