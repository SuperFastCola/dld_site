module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        uglify: {
            options: {
                mangle: false
            },
            my_target: {
                files: {
                    'javascript/src/dld.min.js': ["javascript/src/dld.v2.js"]
                }
            }
        },
        sass: {
            options: {
                sourcemap: 'none',
                trace: true,
                style: 'none'
            },
            compile: {
                files: {
                  'css/style.css': 'css/src/styles.sass',
                }
            }
        },
        inject: {
          single: {
            scriptSrc: 'javascript/src/dld.loader.js',
            files: {
              'index.html': 'html_src/index.html'
            }
          }
        },
        concat: {
            options: {
              separator: ';',
            },
            dist: {
              src: ['javascript/src/lib/angular.min.js','javascript/src/lib/angular-route.min.js','javascript/src/lib/angular-sanitize.min.js','javascript/src/dld.min.js'],
              dest: 'javascript/dld.js',
            },
        },
        replace: {
          dist: {
            options: {
              patterns: [
                {
                  match: 'includecss',
                  replacement: '<%= grunt.file.read("css/src/styles.loading.css") %>'
                }
              ]
            },
            files: [
              {expand: true, flatten: true, src: ['./index.html'], dest: './'}
            ]
          }
        },
        watch: {
            html: {
                files: ['html_src/index.html'],
                tasks: ['inject','replace']
            },
            css: {
                files: ['css/src/styles.sass','css/src/styles.loading.css'],
                tasks: ['sass']
            },
            scripts: {
                files: ['javascript/src/dld.v2.js','javascript/src/dld.loader.js'],
                tasks: ['uglify','concat']
            }
        }

    });

    // Load required modules
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-inject');
    grunt.loadNpmTasks('grunt-replace');
    
    // Default task(s).
    grunt.registerTask('default', ['uglify','sass','inject','concat','replace', 'watch']);
};