var gulp = require('gulp'),
    less = require('gulp-less'), //编译less
    babel = require('gulp-babel'),//es6编译
    rjs = require('gulp-requirejs'),
    uglify = require('gulp-uglify'), //压缩JavaScript文件
    maps = require('gulp-sourcemaps'),
    minifycss = require('gulp-minify-css'), //压缩css文件
    clean = require('gulp-clean'), //清除文件
    plumber = require('gulp-plumber'), //监听错误
    imagemin = require('gulp-imagemin'), //图片压缩
    cache = require('gulp-cache'),
    postcss = require('gulp-postcss'),//css补充
    autoprefixer = require('autoprefixer'),
    svgSymbols = require('gulp-svg-symbols'),//生成svg-symbols
    gulpif = require('gulp-if'),//改变文件夹
    svgmin = require('gulp-svgmin'),//压缩svg
    paths = require('path'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    path = {
        dev: 'dev/',
        dest: 'dest/'
    };

const cssTemplates = paths.join(__dirname, `dev/less/core/svg/svgcssTemplate.css`);

//实时更新
gulp.task('server',['clean','less','r','copy:js','images','svgsprites'],function(){
    browserSync.init({
        proxy: 'asset/doc',
        port: 8090
    });
    gulp.watch('doc/**/*.html').on('change', reload);
    gulp.watch(path.dev + 'js/**/*.js',['r','copy:js']).on('change',reload);
});

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
        .pipe(gulp.dest(path.dest + 'css'))
        .pipe(reload({stream: true}));
});
//js
gulp.task('r', ['clean','clean:js'],function(){
    gulp
    .src(path.dev + 'js/app/common.js')
    .pipe(gulp.dest(path.dest+'js/app'));
    gulp
        .src(path.dev + 'js/config.js')
        .pipe(plumber(function(error) {
            console.log(error);
            console.log('--------------------------  cjs Syntax Error! --------------------------');
        }))
        .pipe(gulp.dest(path.dest+'js'));
    rjs({
        name: 'app/main',
        baseUrl: path.dev + 'js/lib/',
        paths: {
            core: '../core',
            app: '../app'
        },
        mainConfigFile:path.dev + 'js/config.js',
        out: 'main.js',
        optimize: "none"
    })
    .pipe(plumber(function(error) {
        console.log(error);
        console.log('--------------------------  rjs Syntax Error! --------------------------');
    }))
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(gulp.dest(path.dest + 'js/app/'));

})
gulp.task('copy:js', ['clean','clean:js'], function(){
    gulp
        .src(path.dev + 'js/lib/*')
        .pipe(plumber(function(error) {
            console.log(error);
            console.log('--------------------------  js Syntax Error! --------------------------');
        }))
        .pipe(gulp.dest(path.dest + 'js/lib/'));
})
//图片
gulp.task('images', ['clean:images'], function() {
    gulp
        .src(path.dev + 'img/default/**/*.{png,jpg,jpeg,gif}')
        .pipe(cache(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true,
            multipass: true,
        })))
        .pipe(gulp.dest(path.dest + 'img/default/'))
        .pipe(reload({stream: true}));
});
//svgSprites
gulp.task('svgsprites', ['clean:svg'], function(){
    gulp
        .src(path.dev + 'img/svg/**.svg')
        .pipe(svgmin())
        .pipe(svgSymbols({
             id:'svg-%f',
             class:'.svg-%f',
             fontSize:16,
             title: false,
             templates: [`default-svg`, `default-demo`, cssTemplates]
        }))
        .pipe(gulpif('*.css', gulp.dest(path.dev + 'less/core/')))
        .pipe(gulpif('*.svg', gulp.dest(path.dest + 'img/svg/')))
        .pipe(reload({stream: true}));
});


gulp.task('clean',['clean:js','clean:images', 'clean:svg'],function(){
     gulp.start('less','images','svgsprites','r','copy:js');
});
//清理图片
gulp.task('clean:images', function() {
    return gulp
        .src([
            path.dest + 'img/default/*.{png,jpg,jpeg,gif}'
        ], { read: false })
        .pipe(clean({ force: true }));
});
//清除svg雪碧图
gulp.task('clean:svg', function() {
    return gulp
        .src([
            path.dest + 'img/svg/*.svg'
        ], { read: false })
        .pipe(clean({ force: true }));
});
//清除js
gulp.task('clean:js', function() {
    return gulp
        .src([
            path.dest + 'js/**/*'
        ], { read: false })
        .pipe(clean({ force: true }));
});

gulp.task('default', ['clean','server'], function() {
    //监听less
    gulp.watch(path.dev + 'less/**', ['less'])
        .on('change', function(event) {
            console.log('File:' + event.path + 'was:' + event.type + ', running tasks……');
        });
    //监听图片
    gulp.watch(path.dev + 'img/default/**/*.*', ['clean:images', 'images'])
        .on('change', function(event) {
            console.log('File:' + event.path + 'was:' + event.type + ', running tasks……');
        });
    //监听svgsprite
    gulp.watch(path.dev + 'img/svg/*.svg', ['clean:svg','svgsprites'])
        .on('change', function(event) {
            console.log('File:' + event.path + 'was:' + event.type + ', running tasks……');
        });
    // //监听core:js编译
    gulp.watch(path.dev + 'js/**/*', ['clean:js','r', 'copy:js'])
        .on('change', function(event) {
            console.log('File:' + event.path + 'was:' + event.type + ', running tasks……');
        });
})