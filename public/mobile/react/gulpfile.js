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

gulp.task("babel-watch-patient-details", function () {
    return gulp.src("www/app/patient_details/jsx/*")
        .pipe(watch("www/app/patient_details/jsx/*"))
        .pipe(babel())
        .pipe(gulp.dest("www/app/patient_details/js"));
});

// use default task to launch Browsersync and watch JS files
gulp.task("serve", ["babel-landing", "babel-signup", "babel-appointments", "babel-vital-signs", "babel-devices", "babel-availability"], function () {
    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./www/app"
        },
        files: ["www/app/styles/*.css", "www/app/landing/js/*.js", "www/app/signup/js/*.js", "www/app/appointments/js/*.js", "www/app/vital-signs/js/*.js", "www/app/devices/js/*.js", "www/app/availability/js/*.js"],
        port: 3030
    });
});