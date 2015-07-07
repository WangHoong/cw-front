var gulp = require('gulp');
var browserify = require('browserify');
var streamify = require('vinyl-source-stream');
var watchify = require('watchify');
var babelify = require('babelify');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var argv = require('minimist')(process.argv.slice(2));

var DEBUG = !!argv.debug;

var BOWER_COMPONENTS = './bower_components/';
var BUILD = './build/';
var PUBLIC = './public/';

// React vendors
var VENDORS = [
  'react',
  'debug',
  'object-assign',
  'reflux',
  'react-router',
  'axios',
  'kefir',
  'lodash'
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
      .on('error', function(err) {$.util.log('Error : ' + err.message)})
      .pipe(streamify('bundle.js'))
      .pipe(gulp.dest(BUILD + 'js'))
      .pipe($.notify({
  			onLast: true,
        title: 'bundle',
  			message: 'Finished rebundle after ' + (Date.now() - updateStart) + 'ms'
  		}))
      .pipe(reload({stream: true}));
  };
  return rebundle();
});

// Launch BrowserSync development server
gulp.task('sync', function() {
  browserSync({
    logPrefix: 'cw-front',
    proxy: 'http://lo.topdmc.cn:9000'
  });
  return gulp.watch(PUBLIC + 'less/*.less', ['styles']);
});

gulp.task('bower_libs', function() {
  gulp.src(BOWER_COMPONENTS + 'jquery/jquery.min.js')
    .pipe(gulp.dest(BUILD + 'js'));
  gulp.src(BOWER_COMPONENTS + 'jquery/jquery.min.map')
    .pipe(gulp.dest(BUILD + 'js'));
  gulp.src(BOWER_COMPONENTS + 'peity/jquery.peity.min.js')
    .pipe(gulp.dest(BUILD + 'js'));
  gulp.src(BOWER_COMPONENTS + 'echarts/build/dist/echarts-all.js')
    .pipe(gulp.dest(BUILD + 'js'));
  gulp.src(BOWER_COMPONENTS + 'moment/min/moment.min.js')
    .pipe(gulp.dest(BUILD + 'js'));
  gulp.src(BOWER_COMPONENTS + 'fullcalendar/dist/fullcalendar.min.js')
    .pipe(gulp.dest(BUILD + 'js'));
  gulp.src(BOWER_COMPONENTS + 'fullcalendar/dist/lang/zh-cn.js')
    .pipe($.rename('fullcalendar-zh-cn.js'))
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
    .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    .pipe(gulp.dest(BUILD + 'css'))
    .pipe(reload({stream: true}));
});

gulp.task('mbs', function() {
	return gulp.src(PUBLIC + 'less/mbs/mbs.less')
		.pipe($.less())
		.pipe($.minifyCss({keepBreaks: false}))
		.pipe(gulp.dest(BUILD + 'css'));
});

// Build the app
gulp.task('build', function(cb) {
  runSequence(['vendors', 'bundle', 'bower_libs', 'images', 'styles', 'mbs'], 'sync', cb);
});

gulp.task('default', ['build']);
