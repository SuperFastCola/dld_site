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

        concat: {
            options: {
              separator: ';',
            },
            dist: {
              src: ['javascript/src/lib/angular.min.js','javascript/src/lib/angular-route.min.js','javascript/src/lib/angular-sanitize.min.js','javascript/src/dld.min.js'],
              dest: 'javascript/dld.js',
            },
        },
        watch: {
            css: {
                files: ['css/src/styles.sass'],
                tasks: ['sass']
            },
            scripts: {
                files: 'javascript/src/dld.v2.js',
                tasks: ['uglify','concat']
            }
        }

    });

    // Load required modules
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    
    // Default task(s).
    grunt.registerTask('default', ['uglify','sass','concat','watch']);
};