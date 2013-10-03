module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            dist: {
                src: [
                    'src/intro.js',
                    'src/core/bootstrap.js',
                    'src/core/class.js',
                    'src/core/traverse.js',
                    'src/core/type.js',
                    'src/core/rootObject.js',
                    'src/core/observable.js',
                    'src/core/registry/registry.js',

                    'src/core/registry/arrayRegistry.js',
                    'src/core/registry/keyRegistry.js',

                    'src/core/triggerable.js',
                    'src/core/validation.js',

                    'src/core/object.js',
                    'src/outro.js'
                ],
                dest: 'build/<%= pkg.name %>-<%= pkg.version %>.js'
            }
        },

        uglify: {
            options: {
                //sourceMap: 'build/<%= pkg.name %>-<%= pkg.version %>.min.map.js',
                banner: '/*! <%= pkg.name %> v<%= pkg.version %> | build <%= grunt.template.today("yyyymmddhhmmss") %> | license: MIT | https://github.com/makepanic/paraclete */\n'
            },
            build: {
                files: {
                    'build/<%= pkg.name %>-<%= pkg.version %>.min.js': ['build/<%= pkg.name %>-<%= pkg.version %>.js']
                }
            }
        },

        watch: {
            scripts: {
                files: ['src/**/*.js'],
                tasks: ['concat', 'uglify']
            }
        },

        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                singleRun: false
            },
            travis: {
                configFile: 'test/karma.conf.js',
                singleRun: true
            }
        },

        preprocess: {
            options : {
                context : {
                    NAME : '<%= pkg.name %>',
                    VERSION : '<%= pkg.version %>'
                }
            },
            js: {
                src : 'test/karma.conf.raw.js',
                dest : 'test/karma.conf.js'
            }
        },

        clean: ['build']
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-preprocess');
    grunt.loadNpmTasks('grunt-karma');

    // Default task(s).
    grunt.registerTask('default', ['clean', 'concat', 'uglify']);
    grunt.registerTask('dev', ['clean', 'concat', 'uglify', 'watch']);
    grunt.registerTask('test', ['clean', 'concat', 'uglify', 'preprocess', 'karma:unit']);
    grunt.registerTask('ci', ['clean', 'concat', 'uglify', 'preprocess', 'karma:travis']);

};