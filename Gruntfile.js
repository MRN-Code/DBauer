'use strict';
module.exports = function(grunt) {
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);
    require('load-grunt-config')(grunt);

    // By default, lint and run all tests.
    grunt.registerTask('test', function() {
        grunt.log.ok('no tests implemented');
    });

    grunt.registerTask('lint', ['jshint', 'jscs']);
    grunt.registerTask('default', ['lint', 'test']);
};
