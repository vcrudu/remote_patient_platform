/**
 * Created by Victor on 2/21/2016.
 */

var gulp = require("gulp"),
    watch = require("gulp-watch"),
    babel = require("gulp-babel"),
    browserSync = require('browser-sync').create();

gulp.task("babel-landing", function () {
    return gulp.src("www/app/landing/jsx/*")
        .pipe(babel())
        .pipe(gulp.dest("www/app/landing/js"));
});

gulp.task("babel-watch-landing", function () {
    return gulp.src("www/app/landing/jsx/*")
        .pipe(watch("www/app/landing/jsx/*"))
        .pipe(babel())
        .pipe(gulp.dest("www/app/landing/js"));
});

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

gulp.task("babel-network", function () {
    return gulp.src("www/app/network/jsx/*")
        .pipe(babel())
        .pipe(gulp.dest("www/app/network/js"));
});

gulp.task("babel-watch-appointments", function () {
    return gulp.src("www/app/appointments/jsx/*")
        .pipe(watch("www/app/appointments/jsx/*"))
        .pipe(babel())
        .pipe(gulp.dest("www/app/appointments/js"));
});

gulp.task("babel-availability", function () {
    return gulp.src("www/app/availability/jsx/*")
        .pipe(babel())
        .pipe(gulp.dest("www/app/availability/js"));
});

gulp.task("babel-profile", function () {
    return gulp.src("www/app/profile/jsx/*")
        .pipe(babel())
        .pipe(gulp.dest("www/app/profile/js"));
});

gulp.task("babel-timeline", function () {
    return gulp.src("www/app/timeline/jsx/*")
        .pipe(babel())
        .pipe(gulp.dest("www/app/timeline/js"));
});

gulp.task("babel-watch-availability", function () {
    return gulp.src("www/app/availability/jsx/*")
        .pipe(watch("www/app/availability/jsx/*"))
        .pipe(babel())
        .pipe(gulp.dest("www/app/availability/js"));
});

gulp.task("babel-vital-signs", function () {
    return gulp.src("www/app/vital-signs/jsx/*")
        .pipe(babel())
        .pipe(gulp.dest("www/app/vital-signs/js"));
});

gulp.task("babel-watch-vital-signs", function () {
    return gulp.src("www/app/vital-signs/jsx/*")
        .pipe(watch("www/app/vital-signs/jsx/*"))
        .pipe(babel())
        .pipe(gulp.dest("www/app/vital-signs/js"));
});

gulp.task("babel-devices", function () {
    return gulp.src("www/app/devices/jsx/*")
        .pipe(babel())
        .pipe(gulp.dest("www/app/devices/js"));
});

gulp.task("babel-watch-devices", function () {
    return gulp.src("www/app/devices/jsx/*")
        .pipe(watch("www/app/devices/jsx/*"))
        .pipe(babel())
        .pipe(gulp.dest("www/app/devices/js"));
});

gulp.task("babel-watch-profile", function () {
    return gulp.src("www/app/profile/jsx/*")
        .pipe(watch("www/app/profile/jsx/*"))
        .pipe(babel())
        .pipe(gulp.dest("www/app/profile/js"));
});

gulp.task("babel-watch-network", function () {
    return gulp.src("www/app/network/jsx/*")
        .pipe(watch("www/app/network/jsx/*"))
        .pipe(babel())
        .pipe(gulp.dest("www/app/network/js"));
});

gulp.task("babel-watch-timeline", function () {
    return gulp.src("www/app/timeline/jsx/*")
        .pipe(watch("www/app/timeline/jsx/*"))
        .pipe(babel())
        .pipe(gulp.dest("www/app/timeline/js"));
});

gulp.task("babel-watch-profile", function () {
    return gulp.src("www/app/profile/jsx/*")
        .pipe(watch("www/app/profile/jsx/*"))
        .pipe(babel())
        .pipe(gulp.dest("www/app/profile/js"));
});

// use default task to launch Browsersync and watch JS files
gulp.task("serve", ["babel-landing",
                    "babel-signup",
                    "babel-appointments",
                    "babel-vital-signs",
                    "babel-devices",
                    "babel-availability",
                    "babel-profile",
                    "babel-network",
                    "babel-timeline"], function () {
    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./www/app"
        },
        files: [
            "www/app/styles/*.css",
            "www/app/landing/js/*.js",
            "www/app/signup/js/*.js",
            "www/app/appointments/js/*.js",
            "www/app/vital-signs/js/*.js",
            "www/app/devices/js/*.js",
            "www/app/availability/js/*.js",
            "www/app/profile/js/*.js",
            "www/app/network/js/*.js",
            "www/app/timeline/js/*.js"],
        port: 3030
    });
});