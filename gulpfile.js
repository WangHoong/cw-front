// dependencies

var gulp = require('gulp'),
    source = require('vinyl-source-stream'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    less = require('gulp-less'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify'),
    prettyTime = require('pretty-hrtime'),
    htmlreplace = require('gulp-html-replace'),
    runSequence = require('run-sequence').use(gulp),
    qn = require('gulp-qn'),
    babelify = require('babelify');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');


// paths
var dist = './public/dist/';

var lessPath = './public/less/',
    bowerPath = './bower_components/',
    imagePath = './public/images/';

var jsDist = dist + 'js/',
    cssDist = dist + 'css/',
    fontDist = dist + 'fonts/',
    imageDist = dist + 'images/';

var viewsPath = './public/views';
var viewsPublishPath = './views.pub';
var versioning = new Date().valueOf();
var cdnDirPrefix = 'd_' + versioning + '/';

// files

var files = {
    react_app: './app/app.js',
    less_main: lessPath + 'main.less',
    mbs: lessPath + 'mbs/mbs.less',
    all_less: lessPath + '*.less'
};

var reactBuildName = 'bundle.js';

//react-wpk task
gulp.task("react-wpk", function () {
    new WebpackDevServer(webpack(config), {
        publicPath: './dist/js/',
        contentBase: './dist/js/',
        hot: true,
        historyApiFallback: true,
        stats: {colors: true},
        headers: {
            'Access-Control-Allow-Origin': 'http://localhost:9000',
            'Access-Control-Allow-Headers': 'X-Requested-With'
        }
    }).listen(9001, 'localhost', function (err, result) {
            if (err) {
                console.log(err);
            }
            console.log('WebpackDevServer listening at localhost:9001');
        });
})

// react task

gulp.task('react', function () {
    var bundler = browserify({
        entries: files.react_app,
        debug: true,
        cache: {},
        packageCache: {},
        fullPaths: true
    });

    // bundler.transform(envify({
    // 	NODE_ENV: process.env.NODE_ENV,
    // 	PORT: 9000
    // }));

    bundler.external('react');
    bundler.external('react-router');
    bundler.external('events');
    bundler.external('socketcluster-client');
    bundler.external('lodash');
    bundler.external('debug');
    bundler.external('reflux');
    bundler.external('object-assign');
    bundler.external('axios');
    bundler.external('classnames');

    var watcher = watchify(bundler);

    return watcher.on('update', function () {
        var updateStart = Date.now();
        var start = process.hrtime();
        console.log('╭─Updating ' + reactBuildName);
        watcher.bundle()
            .pipe(source(reactBuildName))
            .pipe(gulp.dest(jsDist))
            .pipe(notify({
                onLast: true,
                message: "Finished rebundle after " + prettyTime(process.hrtime(start))
            }))
            .on('finish', function () {
                console.log('╰─Updated ---------- ' + reactBuildName, (Date.now() - updateStart) + 'ms');
            })
            .pipe(reload({stream: true}));
    })
        .bundle()
        .pipe(source(reactBuildName))
        .pipe(gulp.dest(jsDist));
});

gulp.task('client-app', function () {
    browserify({
        entries: './app/app.js',
        extensions: ['.jsx', '.js'],
        debug: true
    })
        .transform(babelify)
        .bundle()
        .pipe(source(reactBuildName))
        .pipe(gulp.dest(jsDist));
});

// minify react

gulp.task('minify_react', function () {
    return gulp.src(jsDist + reactBuildName)
        .pipe(uglify())
        .pipe(gulp.dest(jsDist));
});

// less compiler task

gulp.task('less', function () {
    return gulp.src(files.less_main)
        .pipe(less())
        .pipe(autoprefixer({
            browsers: [
                'last 2 versions'
            ],
            cascade: false
        }))
        .pipe(gulp.dest(cssDist))
        .pipe(reload({stream: true}));
});

// mbs compiler task

gulp.task('mbs', function () {
    return gulp.src(files.mbs)
        .pipe(less())
        .pipe(minifycss({keepBreaks: false}))
        .pipe(gulp.dest(cssDist));
});

// minify css

gulp.task('minify_css', ['css'], function () {
    return gulp.src(cssDist + "main.css")
        .pipe(minifycss({keepBreaks: false}))
        .pipe(gulp.dest(cssDist));
});

// minify images task
gulp.task('images', function () {
    return gulp.src(imagePath + '*')
        .pipe(gulp.dest(imageDist));
});

// build bower

gulp.task('build-bower', function () {

    gulp.src(bowerPath + 'fontawesome/css/font-awesome.min.css')
        .pipe(gulp.dest(cssDist));
    gulp.src(bowerPath + 'nvd3-community/build/nv.d3.min.css')
        .pipe(gulp.dest(cssDist));

    return gulp.src(bowerPath + 'fontawesome/fonts/*')
        .pipe(gulp.dest(fontDist));

});

// all cssDist
gulp.task('css', ['less', 'build-bower', 'mbs']);


// browser sync

gulp.task('browser-sync', function () {
    return browserSync({
        files: [
            viewsPath + '/*.html'
        ],
        server: {
            baseDir: './',
            proxy: 'localhost:9001',
            index: './public/views/index.html'
        }
    });
});

var qiniu_credential = {
    accessKey: "WUK0psKjxDO3cdkus9uZgswJps-nFpJMFk2SzSlv",
    secretKey: "Ojn74NudW__RE-mpM-Pahq_zBWvZuSD_db9Imhl7",
    bucket: "topdmc-test"
};

// qiniu CDN
gulp.task('cdn-font', function () {
    return gulp.src('./dist/fonts/*')
        .pipe(qn({
            qiniu: qiniu_credential,
            prefix: '/fonts/'
        }));
});

gulp.task('cdn-css', function () {
    return gulp.src('./dist/css/*')
        .pipe(qn({
            qiniu: qiniu_credential,
            prefix: cdnDirPrefix + '/css/'
        }));
});

gulp.task('cdn-image', function () {
    return gulp.src('./dist/images/*')
        .pipe(qn({
            qiniu: qiniu_credential,
            prefix: cdnDirPrefix + '/images/'
        }));
});

gulp.task('cdn-js', function () {
    return gulp.src('./dist/js/*')
        .pipe(qn({
            qiniu: qiniu_credential,
            prefix: cdnDirPrefix + '/js/'
        }));
});

gulp.task('replace', function () {
    var base_url = "http://7xijye.com1.z0.glb.clouddn.com/" + cdnDirPrefix;
    return gulp.src(['./views/index.html', './views/login.html'])
        .pipe(htmlreplace({
            main_js: [base_url + 'js/vendor.min.js', base_url + 'js/bundle.min.js'],
            css: [
                base_url + 'css/font-awesome.min.css',
                base_url + 'css/mbs.css',
                base_url + 'css/main.css',
                base_url + 'css/nv.d3.min.css'
            ],
            dep_js: [base_url + 'js/react.min.js',
                base_url + 'js/ReactRouter.min.js',
                base_url + 'js/lodash.min.js',
                base_url + 'js/axios.min.js',
                base_url + 'js/reflux.min.js',
                base_url + 'js/kefir.min.js',
                base_url + 'js/jquery.min.js',
                base_url + 'js/jquery.peity.min.js',
                base_url + 'js/d3.min.js',
                base_url + 'js/echarts-all.js',
                base_url + 'js/nv.d3.min.js']
        }))
        .pipe(gulp.dest(viewsPublishPath));
});

// 把views复制到views.pub目录，对views.pub页面做变形
gulp.task('duplicate-views', function () {
    gulp.src('./views/**/*').pipe(gulp.dest(viewsPublishPath));
});

gulp.task('publish', function (cb) {
    runSequence('cdn-font', 'cdn-css', 'cdn-js', 'cdn-image', 'duplicate-views', 'replace', cb);
});

// default task

var isDev = process.env.NODE_ENV === 'development';

if (!isDev) {
    proTask();
} else {
    devTask();
}

function devTask() {
    gulp.task('default', ['images', 'less', 'mbs', 'react-wpk', 'build-bower'], function () {
        gulp.start('browser-sync');
        gulp.watch(files.all_less, ['less']);
    });
}

function proTask() {
    gulp.task('default', ['minify_css', 'mbs', 'images']);
}
