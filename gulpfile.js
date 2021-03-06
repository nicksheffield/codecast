var gulp          = require('gulp')                         // the main guy
var clone         = require('gulp-clone')                   // used to fork a stream
var order         = require('gulp-order')                   // reorder files in stream
var babel         = require('gulp-babel')                   // turn es6 into es5
var uglify        = require('gulp-uglify')                  // minify js
var rename        = require('gulp-rename')                  // rename file
var concat        = require('gulp-concat')                  // merge files together
var stylus        = require('gulp-stylus')                  // turn stylus into css
var addsrc        = require('gulp-add-src')                 // mid-stream gulp.src()
var notify        = require('gulp-notify')                  // OS-level notifications
var plumber       = require('gulp-plumber')                 // handle errors without crashing
var annotate      = require('gulp-ng-annotate')             // safely minify angular
var beautify      = require('gulp-cssbeautify')             // make files human readable
var minifycss     = require('gulp-minify-css')              // minify css code
var sourcemap     = require('gulp-sourcemaps')              // create sourcemaps
var autoprefix    = require('gulp-autoprefixer')            // prefix any css with low support
var templateCache = require('gulp-angular-templatecache')   // cache angular template files

var paths = {
	stylus: {
		files: ['app/stylus/*.styl', 'app/stylus/**/*.styl'],
		main: 'app/stylus/main.styl'
	},
	views: ['app/angular/**/*.html'],
	angular: ['app/angular/*.js', 'app/angular/**/*.js'],
	output: 'app/dist/'
}

var plumberOpts = {
	errorHandler: notify.onError("Error: <%= error.message %>")
}

gulp.task('css', function() {

	// prepare css code
	var stream = gulp.src(paths.stylus.main)          // grab our stylus file
		.pipe(plumber(plumberOpts))                   // notify us if any errors appear
		//.pipe(sourcemap.init())                       // get ready to write a sourcemap
		.pipe(stylus())                               // turn the stylus into css
		//.pipe(sourcemap.write())                      // write the sourcemap
		.pipe(autoprefix('last 2 versions'))          // autoprefix the css code
	
	// make style.css
	stream.pipe(clone())                              // make a copy of the stream up to autoprefix
		.pipe(beautify())                             // make css really readable
		.pipe(gulp.dest(paths.output))                // save it into the dist folder
	
	// make style.min.css
	stream.pipe(clone())                              // make a copy of the stream up to autoprefix
		.pipe(minifycss())                            // minify it (removes the sourcemap)
		//.pipe(sourcemap.write())                      // write the sourcemap
		.pipe(rename('style.min.css'))                // add .min to the filename
		.pipe(gulp.dest(paths.output))                // save it into the dist folder
	
	return stream

})



gulp.task('angular', function() {
	
	var tplCacheOpts = {
		module: 'app.views'
	}

	var stream = gulp.src(paths.views)                      // grab all the html views
		.pipe(plumber())                                    // stop any errors from breaking a watch
		.pipe(templateCache('templates.js', tplCacheOpts))  // make a template cache from them
		.pipe(addsrc(paths.angular))                        // add the rest of the angular app
		.pipe(order(['app.js']))                            // make sure app.js is first
		.pipe(babel({ presets: ['es2015'] }))
		.pipe(annotate())                                   // make angular callbacks minifyable
		.pipe(uglify())                                     // minify the code
		.pipe(concat('app.min.js'))                         // merge them all into the same file
		.pipe(gulp.dest(paths.output))                      // save it into the dist folder
		
	return stream
	
})



gulp.task('watch', ['angular', 'css'], function() {
	
	gulp.watch(paths.stylus.files, ['css'])
	gulp.watch(paths.angular,      ['angular'])
	gulp.watch(paths.views,        ['angular'])
	
})



gulp.task('default', ['css', 'angular'], function(){
	
	console.log('Ready to go!')
	
})