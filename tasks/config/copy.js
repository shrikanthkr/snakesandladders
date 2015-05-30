module.exports = function(grunt) {

    grunt.config.set('copy', {
        dev: {
            files: [{
                expand: true,
                cwd: './assets',
                // Before: src: ['**/*.!(coffee|less)'],
                src: ['**/*.!(coffee|less|scss|sass)'],
                dest: '.tmp/public'
            }]
        },
        build: {
            files: [{
                expand: true,
                cwd: '.tmp/public',
                src: ['**/*'],
                dest: 'www'
            }]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
};