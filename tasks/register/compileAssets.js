module.exports = function (grunt) {
	grunt.registerTask('compileAssets', [
		'clean:dev',
		'jst:dev',
		'copy:dev',
		'sass:dev',
		'coffee:dev'
	]);
};
