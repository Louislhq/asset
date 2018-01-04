var gulp = require('gulp'),
    less = require('gulp-less'), //编译less
    rjs = require('gulp-requirejs'),
    uglify = require('gulp-uglify'), //压缩JavaScript文件
    maps = require('gulp-sourcemaps'),
    minifycss = require('gulp-minify-css'), //压缩css文件
    sprite = require('gulp.spritesmith'), //处理雪碧图
    clean = require('gulp-clean'), //清除文件
    plumber = require('gulp-plumber'), //监听错误
    concat = require('gulp-concat'), //合并javascript文件
    imagemin = require('gulp-imagemin'), //图片压缩
    cache = require('gulp-cache'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    amdOptimize = require("amd-optimize"),
    path = {
        dev: 'dev/',
        dest: 'dest/'
    };


//less
gulp.task('less', function() {
    gulp
        .src(path.dev + 'less/styles.less')
        .pipe(maps.init())
        .pipe(plumber(function(error) {
            console.log(error);
            console.log('--------------------------  less Syntax Error! --------------------------');
        }))
        .pipe(less())
        .pipe(minifycss({ compatibility: 'ie7' }))
        .pipe(postcss([autoprefixer({
            browsers: [
                'last 20 versions'
            ]
        })]))
        .pipe(gulp.dest(path.dest + 'css'));
});
//requirejs
gulp.task('requirejsBuild', function() {
    // rjs({
    //     name: 'app/main',
    //     baseUrl: path.dev + 'js/lib/',
    //     paths: {
    //         core: '../core',
    //         app: '../app'
    //     },
    //     mainConfigFile: path.dev + 'js/config.js',
    //     out: 'main.js',
    //     optimize: false
    // })

    // .pipe(gulp.dest(path.dest + 'js/app/'));
    gulp
        .src(path.dev + 'js/**/*')
        .pipe(amdOptimize('config'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest(path.dest + 'js/app/'))
});

//图片
gulp.task('images', function() {
    gulp
        .src(path.dev + 'img/default/**/*.{png,jpg,jpeg,gif}')
        .pipe(cache(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true,
            multipass: true
        })))
        .pipe(gulp.dest(path.dest + 'img/default/'));
});
//雪碧图
gulp.task('sprite', function() {
    var spriteData = gulp
        .src(path.dev + 'img/sprite/**.png')
        .pipe(sprite({
            imgName: 'sprite.png',
            cssName: 'sprite-png.less',
            cssTemplate: path.dev + 'less/core/handlebarsStr.css.handlebars',
            imgPath: '../img/sprite.png',
            padding: 15
        }));
    spriteData
        .img
        .pipe(gulp.dest(path.dest + 'img/'));
    spriteData
        .css
        .pipe(gulp.dest(path.dev + 'less/core/'));
});

//清理图片
gulp.task('clean:images', function() {
    gulp
        .src([
            path.dest + 'img/default/*.{png,jpg,jpeg,gif}'
        ], { read: false })
        .pipe(clean({ force: true }));
});
//监听
gulp.task('watch', function() {
    //监听less
    gulp.watch(path.dev + 'less/**', ['less'])
        .on('change', function(event) {
            console.log('File:' + event.path + 'was:' + event.type + ', running tasks……');
        });
    //监听图片
    gulp.watch(path.dev + 'img/default/**/*.*', ['clean:images', 'images']);
    //监听sprite
    gulp.watch(path.dev + 'img/sprite/*.png', ['sprite']);
});
gulp.task('default', ['less', 'watch', 'images', 'sprite', 'requirejsBuild'], function() {})