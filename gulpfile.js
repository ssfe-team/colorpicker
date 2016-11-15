var gulp = require('gulp'),
	babel = require('gulp-babel'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename');

//compile
gulp.task('compile', function() {
	gulp.src('src/*.js')
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest('dist'));
});

//compress
gulp.task('compress', function() {
	gulp.src('dist/*.js')
		.pipe(rename(function(path) {
			path.basename += '.min';
		}))
	    .pipe(uglify())
	    .pipe(gulp.dest('dist'));
});
