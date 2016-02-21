/**
 * Created by Victor on 2/21/2016.
 */

var gulp = require("gulp"),
    watch = require("gulp-watch"),
    babel = require("gulp-babel"),
    browserSync = require('browser-sync').create();

gulp.task("babel", function () {
    return gulp.src("www/app/signup/jsx/patient-signup.jsx")
        .pipe(babel())
        .pipe(gulp.dest("www/app/signup/js"));
});

// use default task to launch Browsersync and watch JS files
gulp.task('serve', ['babel'], function () {
    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./www/app"
        },
        files: ["www/app/styles/*.css", "www/app/signup/js/*.js"],
        port: 3030
    });
});