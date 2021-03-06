var gulp = require('gulp');
var postcss = require('postcss');
var gulpPostcss = require('gulp-postcss');
var less = require('./');
var gutil = require('gulp-util');

var autoprefixer = require('autoprefixer');
var clean = require('postcss-clean');

var fs = require('fs');
var path = require('path');

gulp.task('test', function() {
    var mocha = require('gulp-mocha');
    return gulp.src('test/parse.js', { read: false })
    	.pipe(mocha({ reporter: 'list' }))
    	.on('error', gutil.log);
});



gulp.task('gulp', function (done) {
	var future = require('less-plugin-future-compat');
	var reporter = require('postcss-reporter');

    return gulp.src('./test/less/comments.less')
	    .pipe(
	        gulpPostcss([
	            less({ 
	            	plugins: [future]
	            })
	            , reporter()
	        ], { parser: less.parser })
	    )
	    .on('end', function(){ gutil.log('Done!'); });
});


function testLess(filename, plugins) {
    var testFile = fs.readFileSync(path.join(__dirname, 'test/less/' + filename + '.less'), { });

    return postcss(plugins).process(testFile.toString(), { parser: less.parser, from: 'test/less/' + filename + '.less' }).then(function (result) {
		console.log(result.css);
	}, function(err) {
		console.log(err.message);
	});
}

gulp.task('integration', function(done) {
	testLess('tests', [less(), autoprefixer()]);
});

gulp.task('plugins', function(done) {
	testLess('plugins', [less({ strictMath: true }), autoprefixer(), clean()]);
});


gulp.task('benchmark', function(done) {
    testLess('benchmark', [less()]);
});