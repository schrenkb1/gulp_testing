// Packages to Load 
// gulp, yargs, gulp-load-plugins, gulp-if, gulp-uglify
// gulp-concat, gulp-uncss, gulp-jscs, gulp-jshint
// gulp-util, gulp-print, gulp-header gulp-inject Wiredep
//
// --  Include Plugins  -- //

var gulp = require('gulp');
var es = require('event-stream');
var config = require('./config.json');
var $ = require('gulp-load-plugins')({lazy: true});

// --  Custom JavaScript Functions  -- //

function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.yellow(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.yellow(msg));
    }
};

// --  Gulp Tasks  -- //

gulp.task('vet', function() {
    log('Analyzing source with JSHint and JSCS');

    return gulp
        .src(config.data.allJs)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
        .pipe($.jshint.reporter('fail'))
        .pipe($.jscs());
});

gulp.task('scripts', function () {
	log('Analyzing Javascript, Minify, and Concat');
	
	var javaScriptFromCoffeeScript = gulp
		.src(config.data.srcCoffee)
		.pipe($.coffee());

	var javaScript = gulp
		.src(config.data.srcJs);

	return es.merge(javaScriptFromCoffeeScript, javaScript)

    //.pipe($.jscs()) // Check JavaScript code style 
    //.pipe($.jshint()) // JavaScript Code Quality Tool
    .pipe($.uglify()) // Minify files
    .pipe($.concat('all.min.js')) // Concat files
	.pipe(gulp.dest(config.data.destJs));
});

gulp.task('style', function () {
	log('Concat, Minify CSS');

	var stylesheet = gulp
		.src(config.data.srcCss);

	return es.merge(stylesheet)
    .pipe($.uglifycss()) // Minify files
    // gulp-uncss
    .pipe($.concat('all.min.css')) // Concat files
	.pipe(gulp.dest(config.data.destCss));
});

gulp.task('wiredep', function() {
	log('Wiredep Inject Bower Components');
	var wiredep = require('wiredep').stream;

	gulp.src(config.data.views)
        .pipe(wiredep({
			bowerJson: require('./bower.json'),
			directory: './bower_components/',
			ignorePath: '../..'
        }))
    .pipe(gulp.dest(config.data.dest));
});

gulp.task('personalize',['style', 'scripts', 'wiredep'], function () {
	log('Inject Custom JavaScript and CSS');
	var target = gulp.src(config.data.destHtml);
	var sources = gulp.src(['./dest/js/*.js', './dest/css/*.css'], {read: false});

	return target.pipe($.inject(sources , {relative: true}))
		.pipe(gulp.dest(config.data.dest));
});
	
gulp.task('build', ['scripts', 'style', 'wiredep', 'personalize']);
	log('Running Build Sub-tasks style and script');

gulp.task('default', ['build']);