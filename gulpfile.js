var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var pngquant = require('imagemin-pngquant');
var argv = require('minimist')(process.argv.slice(2));

var browserify = require('browserify');
var streamify = require('vinyl-source-stream');
var watchify = require('watchify');
var babelify = require('babelify');

var DEBUG = !!argv.debug;

var BOWER_COMPONENTS = './bower_components/';
var BUILD = './build/';
var PUBLIC = './public/';

var src = {};

// React vendors
var VENDORS = [
  'react',
  'debug',
  'object-assign',
  'reflux',
  'react-router',
  'axios',
  'lodash',
  'numeral'
];

// https://github.com/ai/autoprefixer
var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

// Build react vendors
gulp.task('vendors', function(cb) {
  var bundler = browserify();
  VENDORS.forEach(function(name) {
    bundler.require(name);
  });
  return bundler.bundle().pipe(streamify('vendor.js')).pipe(gulp.dest(BUILD + 'js'));
});

gulp.task('bundle', function(cb) {
  var bundler = browserify({
    entries: ['node_modules/app/app.jsx'],
    debug: DEBUG,
    cache: {},
    packageCache: {},
    fullPaths: true,
    transform: [babelify]
  });
  VENDORS.forEach(function(name) {
    bundler.external(name);
  });
  if (DEBUG) {
    var watcher = watchify(bundler);
    watcher.on('update', rebundle);
  }

  function rebundle() {
    var updateStart = Date.now();
    return bundler.bundle()
      .on('error', function(err) {
        $.util.log('Error : ' + err.message);
        console.log(err);
        this.emit('end');
      })
      .pipe(streamify('bundle.js'))
      .pipe(gulp.dest(BUILD + 'js'))
      .pipe($.notify({
        onLast: true,
        title: 'bundle',
        message: 'Finished rebundle after ' + (Date.now() - updateStart) + 'ms'
      }))
      .pipe(reload({
        stream: true
      }));
  };
  return rebundle();
});

// Launch BrowserSync development server
gulp.task('sync', function() {
  browserSync({
    files: './views/*.html',
    logPrefix: 'cw-front',
    proxy: 'http://lo.topdmc.cn:9000',
    host: 'lo.topdmc.cn',
    open: 'external'
  });
  gulp.watch(PUBLIC + 'less/*.less', ['styles']);
  gulp.watch(PUBLIC + 'js/*.js', ['js']);
});

gulp.task('bower_libs', function() {
  gulp.src([
    BOWER_COMPONENTS + 'jquery/jquery.min.js',
    BOWER_COMPONENTS + 'jquery/jquery.min.map',
    BOWER_COMPONENTS + 'kefir/dist/kefir.min.js',
    BOWER_COMPONENTS + 'echarts/build/dist/echarts-all.js',
    BOWER_COMPONENTS + 'moment/min/moment.min.js'
  ]).pipe(gulp.dest(BUILD + 'js'));
  gulp.src(BOWER_COMPONENTS + 'moment/locale/zh-cn.js')
    .pipe($.rename('moment.zh-cn.js'))
    .pipe(gulp.dest(BUILD + 'js'));
  gulp.src(BOWER_COMPONENTS + 'fontawesome/css/font-awesome.min.css')
    .pipe(gulp.dest(BUILD + 'css'));
  return gulp.src(BOWER_COMPONENTS + 'fontawesome/fonts/*')
    .pipe(gulp.dest(BUILD + 'fonts'));
});

gulp.task('images', function() {
  return gulp.src(PUBLIC + 'images/*')
    .pipe(gulp.dest(BUILD + 'images'));
});

gulp.task('styles', function() {
  return gulp.src(PUBLIC + 'less/main.less')
    .pipe($.less())
    .pipe($.autoprefixer({
      browsers: AUTOPREFIXER_BROWSERS
    }))
    .pipe(gulp.dest(BUILD + 'css'))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('styles:minify', function() {
  return gulp.src(BUILD + 'css/main.css')
    .pipe($.minifyCss())
    .pipe(gulp.dest(BUILD + 'css'));
});

gulp.task('mbs', function() {
  return gulp.src(PUBLIC + 'less/mbs/mbs.less')
    .pipe($.less())
    .pipe($.minifyCss({
      keepBreaks: false
    }))
    .pipe(gulp.dest(BUILD + 'css'));
});

gulp.task('mbs:minify', function() {
  return gulp.src(BUILD + 'css/mbs.css')
    .pipe($.minifyCss())
    .pipe(gulp.dest(BUILD + 'css'));
});

gulp.task('bundle:minify', function() {
  return gulp.src(BUILD + 'js/bundle.js')
    .pipe($.uglify())
    .pipe(gulp.dest(BUILD + 'js'));
});

gulp.task('vendor:minify', function() {
  return gulp.src(BUILD + 'js/vendor.js')
    .pipe($.uglify())
    .pipe(gulp.dest(BUILD + 'js'));
});

gulp.task('images:minify', function() {
  return gulp.src(BUILD + 'images/*')
    .pipe($.imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(BUILD + 'images'));
});

gulp.task('js', function() {
  return gulp.src(PUBLIC + 'js/*.js')
    .pipe($.concat('common.js'))
    .pipe(gulp.dest(BUILD + 'js'))
    .pipe(reload({stream: true}));
});

gulp.task('js:minify', function() {
  return gulp.src(BUILD + 'js/common.js')
    .pipe($.uglify())
    .pipe(gulp.dest(BUILD + 'js'));
});

gulp.task('config', function() {
  return gulp.src(PUBLIC + 'config/*.json')
    .pipe(gulp.dest(BUILD + 'config'));
});

// 临时
gulp.task('build:dmc_index', function() {
  gulp.src(PUBLIC + 'dmc_index.css')
    .pipe(gulp.dest(BUILD + 'css'));
  return gulp.src(PUBLIC + 'dmc_index.js')
    .pipe(gulp.dest(BUILD + 'js'));
});

// Build the app
gulp.task('build', function(cb) {
  if (DEBUG) {
    runSequence(['vendors', 'bundle', 'bower_libs', 'images', 'styles', 'mbs', 'build:dmc_index', 'js', 'config'], 'sync', function() {
      cb();
    });
  } else {
    runSequence(['vendors', 'bundle', 'bower_libs', 'images', 'styles', 'mbs', 'build:dmc_index', 'js', 'config'], ['styles:minify', 'mbs:minify', 'bundle:minify', 'vendor:minify', 'images:minify', 'js:minify'], function() {
      cb();
    });
  }
});

var started = false;
// Launch a Node.js/Express server
gulp.task('serve', ['build'], function(cb) {
  src.server = [
    './server.js',
    './lib/*.js',
    './config/*.json'
  ];

  var started = false;
  var cp = require('child_process');

  var server = (function startup() {
    var child = cp.fork('./server.js', {
      env: {
        NODE_ENV: process.env.NODE_ENV || 'development'
      }
    });
    child.once('message', function(message) {
      if (message.match(/^online$/)) {
        if (browserSync) {
          browserSync.reload();
        }
        if (!started) {
          started = true;
          gulp.watch(src.server, function() {
            $.util.log('Restarting development server.');
            server.kill('SIGTERM');
            server = startup();
          });
          cb();
        }
      }
    });
    return child;
  })();

  process.on('exit', function() {
    server.kill('SIGTERM');
  });
});

gulp.task('default', ['build']);
