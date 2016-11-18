'use strict';
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var Vulcanize = require('vulcanize');

module.exports = function (opts) {
	opts = opts || {};

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-vulcanize', 'Streaming not supported'));
			return;
		}

		// vulcanize expects target path to be relative to abspath
		let filePath = opts.abspath ? path.relative(opts.abspath, file.path) : file.path;

		(new Vulcanize(opts)).process(filePath, function (err, inlinedHtml) {
			if (err) {
				cb(new gutil.PluginError('gulp-vulcanize', err, {fileName: filePath}));
				return;
			}

			file.contents = new Buffer(inlinedHtml);
			cb(null, file);
		});
	});
};
