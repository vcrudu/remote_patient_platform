/**
 * Created by Victor on 2/21/2016.
 */

var gulp = require("gulp"),
    watch = require("gulp-watch"),
    babel = require("gulp-babel"),
    browserSync = require('browser-sync').create();

gulp.task("babel-signup", function () {
    return gulp.src("www/app/signup/jsx/*")
        .pipe(babel())
        .pipe(gulp.dest("www/app/signup/js"));
});

gulp.task("babel-watch-signup", function () {
    return gulp.src("www/app/signup/jsx/*")
        .pipe(watch("www/app/signup/jsx/*"))
        .pipe(babel())
        .pipe(gulp.dest("www/app/signup/js"));
});

gulp.task("babel-appointments", function () {
    return gulp.src("www/app/appointments/jsx/*")
        .pipe(babel())
        .pipe(gulp.dest("www/app/appointments/js"));
});

gulp.task("babel-watch-appointments", function () {
    return gulp.src("www/app/appointments/jsx/*")
        .pipe(watch("www/app/appointments/jsx/*"))
        .pipe(babel())
        .pipe(gulp.dest("www/app/appointments/js"));
});

// use default task to launch Browsersync and watch JS files
gulp.task('serve', ['babel-signup', 'babel-appointments'], function () {
    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./www/app"
        },
        files: ["www/app/styles/*.css", "www/app/signup/js/*.js", "www/app/appointments/js/*.js"],
        port: 3030
    });
});