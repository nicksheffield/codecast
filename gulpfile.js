"use strict"

const gulp = require('gulp')
const minify = require('gulp-clean-css')
const stylus = require('gulp-stylus')
const rename = require('gulp-rename')
const autoprefix = require('gulp-autoprefixer')
const notify = require('gulp-notify')
const plumber = require('gulp-plumber')

var paths = {
	css: {
		all: ['assets/style/**/*.styl', 'assets/style/*.styl'],
		main: 'assets/style/__main.styl',
		name: 'style.min.css'
	},
	output: 'assets/dist/'
}

function errorHandler() {
	return plumber({
		errorHandler: notify.onError("Error: <%= error.message %>")
	})
}

gulp.task('css', function() {
	const stream = gulp.src(paths.css.main)
		.pipe(errorHandler())
		.pipe(stylus())
		.pipe(autoprefix())
		.pipe(minify())
		.pipe(rename(paths.css.name))
		.pipe(gulp.dest(paths.output))
			
	return stream
})

gulp.task('watch', ['css'], function() {
	gulp.watch(paths.css.all, ['css'])
})

gulp.task('default', ['css'])