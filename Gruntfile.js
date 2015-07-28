'use strict';

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        '*.js',
        'spec/**/*.js'
      ]
    },

    watch: {
      js: {
        files: [
          '.jshintrc',
          '*.js',
          'spec/**/*.spec.js'
        ],
        tasks: [
          'test'
        ],
      }
    },

    karma: {
      options: {
        files: [
          'node_modules/angular/angular.js',
          'node_modules/angular-mocks/angular-mocks.js',
          'angular-checkboxes.js',
          'spec/angular-checkboxes.spec.js'
        ]
      },
      unit: {
        frameworks: ['jasmine'],
        singleRun: true,
        browsers: ['PhantomJS'],
        reporters: ['spec', 'coverage'],
        // logLevel: 'DEBUG',
        plugins: [
          'karma-spec-reporter',
          'karma-jasmine',
          'karma-phantomjs-launcher',
          // 'karma-chrome-launcher',
          // 'karma-firefox-launcher',
          'karma-coverage'
        ],
        preprocessors: {
          './angular-checkboxes.js': ['coverage']
        },
        coverageReporter: {
          dir: 'coverage',
          reporters: [
            { type: 'lcov', subdir: 'report-lcov' },
          ]
        }
      }
    }
  });

  grunt.registerTask('default', [
    'test'
  ]);

  grunt.registerTask('test', [
    'jshint:all',
    'karma:unit',
  ]);


};