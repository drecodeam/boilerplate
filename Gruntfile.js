// Written by Kevin H <nehalist.io>
//
// "Your work is going to fill a large part of your life, and the only way to
// be truly satisfied is to do what you believe is great work. And the only way
// to do great work is to love what you do." - Steve Jobs

/* jshint ignore:start */

"use strict";

// Needed for NodeJS
var path        = require('path')
,   YAML        = require('yamljs');

module.exports = function(grunt) {
    // ### Get theme information
    //
    // TODO: I'm pretty sure that there's a faster and more elegant way
    // to do this. Also this probably should be implemented as a grunt task.
    var styleCSS;
    var themeData = {
        name: 'Boilerplate',
        version: '0.0.0'
    };
    if(grunt.file.exists('style.css')) {
        styleCSS = grunt.file.read('style.css');

        // Split the file by the first '*/' symbols to get the theme information
        var themeFile = styleCSS.split('*/');

        // Split the theme information by lines
        var themeDataLines = themeFile[0].split('\n');

        // Remove first element since it's '*/'
        themeDataLines.splice(0, 1);

        // Iterate through the lines
        for(var i = 0; i <= themeDataLines.length; i++) {
            var rawInformation = themeDataLines[i];
            if(typeof rawInformation === 'string') {
                var split = rawInformation.split(':');

                if(split[0] === 'Version') {
                    themeData.version = split[1].trim();
                }
                if(split[0] === 'Theme Name') {
                    themeData.name = split[1].trim();
                }
            }
        }
    }

    // Enable time tracking for tasks
    require('time-grunt')(grunt);

    // Load all avaiable grunt tasks
    require('jit-grunt')(grunt, {
        'shell'         : 'grunt-shell-spawn',
        'scsslint'      : 'grunt-scss-lint',
        'revision'      : 'grunt-git-revision',
        'usebanner'     : 'grunt-banner',
        'removelogging' : 'grunt-remove-logging',
        'autoprefixer'  : 'grunt-autoprefixer',
        'imagemin'      : 'grunt-contrib-imagemin',
        'browserSync'   : 'grunt-browser-sync'
    });


    var validation = (grunt.option('live-validation') ? true : false);
    var watchTasks = {
        sass:   [],
        css:    [],
        js:     []
    };

    if(validation) {
        watchTasks.sass = ['scsslint', 'sass', 'autoprefixer'];
        watchTasks.css  = ['csslint', 'autoprefixer'];
        watchTasks.js   = ['concat:js', 'jshint'];
    } else {
        watchTasks.sass = ['sass', 'autoprefixer'];
        watchTasks.css  = ['autoprefixer'];
        watchTasks.js   = ['concat:js'];
    }

    var build = grunt.file.readJSON('manifest.json');

    // Configure grunt
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        '*.php',
                        'templates/*.php',
                        'libs/*.php',
                        'libs/**/*.php',

                        '.tmp/**/*.css',
                        '.tmp/**/*.js',

                        'style.css'
                    ]
                },
                options: build.options.browser_sync
            }
        },

        /*
        |----------------------------------------------------------
        | Watch
        |----------------------------------------------------------
        |
        | Run predefined tasks whenever watched file patterns are added,
        | changed or deleted.
        |
        */
        watch: {
            // BOWER COMPONENTS
            bower_components: {
                files: [
                    'bower.json'
                ],
                tasks: ['shell:bower', 'bower_concat']
            },

            // SASS
            sass: {
                files: [
                    'assets/sass/*.{scss,sass}'
                ],
                tasks: watchTasks.sass
            },

            // JS FILES
            js: {
                files: [
                    'assets/javascripts/*.js'
                ],
                tasks: watchTasks.js
            },

            // CSS FILES
            css: {
                files: [
                    'style.css'
                ],
                tasks: watchTasks.css,
                options: {
                    spawn: false
                }
            },

            images: {
                files: [
                    'assets/images/*.{png,jpg,gif}'
                ],
                tasks: ['imagemin'],
                options: {
                    spawn: false
                }
            },

            // build
            build: {
                files: [
                    'Gruntfile.js',
                    'manifest.json'
                ],
                options: {
                    reload: true
                }
            }
        },


        /*
        |----------------------------------------------------------
        | Bower
        |----------------------------------------------------------
        |
        | Package manager
        |
        */
        shell: {
            options: {
                stdout: true,
                stderr: true
            },
            bower: {
                command: path.resolve(process.cwd() + '/node_modules/.bin/bower --allow-root install')
            },
            bower_prune: {
                command: path.resolve(process.cwd() + '/node_modules/.bin/bower prune')
            }
        },

        // Concatenation of bower components
        bower_concat: {
            all: {
                dest: '.tmp/assets/vendor/vendor.js',
                cssDest: '.tmp/assets/vendor/vendor.css'
            }
        },


        /*
        |----------------------------------------------------------
        | SASS
        |----------------------------------------------------------
        |
        | Compile SASS to CSS
        |
        */
        sass: {
            dist: {
                options: {
                    sourcemap: 'none'
                },
                files: {
                    '.tmp/assets/stylesheets/additional.css': 'assets/sass/base.scss'
                }
            }
        },


        /*
        |----------------------------------------------------------
        | SCSS Linting
        |----------------------------------------------------------
        */
        scsslint: {
            options: YAML.stringify(build.scsslint_options),
            allFiles: [
                'assets/sass/*.{scss,sass}'
            ]
        },


        /*
        |----------------------------------------------------------
        | CSS Linting
        |----------------------------------------------------------
        */
        csslint: {
            dist: {
                options: build.csslint_options,
                src: ['style.css']
            }
        },


        /*
        |----------------------------------------------------------
        | Concat
        |----------------------------------------------------------
        */
        concat: {
            js: {
                src: ['assets/javascripts/*.js'],
                dest: '.tmp/assets/javascripts/main.js'
            },
            css_dist: {
                options: {
                    separator: grunt.util.linefeed + '/** -- Additional CSS -- **/' + grunt.util.linefeed
                },
                src: ['style.css', '.tmp/assets/stylesheets/additional.css'],
                dest: 'dist/style.css'
            }
        },


        /*
        |----------------------------------------------------------
        | JSHint
        |----------------------------------------------------------
        */
        jshint: {
            options: build.jshint_options,
            dist: ['.tmp/assets/javascripts/main.js']
        },


        /*
        |----------------------------------------------------------
        | Clean
        |----------------------------------------------------------
        */
        clean: {
            tmp: {
                src: [
                    '!.tmp/.gitignore',
                    '.tmp/assets/*',
                    '.tmp/*'
                ]
            },

            dist: {
                src: [
                    '!dist/.gitkeep',
                    'dist/*'
                ]
            }
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    src: [
                        '*.php',
                        'templates/*.php',
                        'readme.md',
                        'readme.txt',
                        'license',
                        'screenshot.png',
                        'style.css',
                        'libs/**/*'
                    ],
                    dest: 'dist/',
                }, {
                    expand: true,
                    cwd: '.tmp/',
                    src: [
                        'assets/vendor/*',
                        'assets/javascripts/*',
                        'assets/images/*',
                        'assets/fonts/*'
                    ],
                    dest: 'dist'
                }]
            },

            icons: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: 'bower_components/bootstrap/dist/fonts',
                    src: ['*.*'],
                    dest: 'assets/fonts'
                }, {
                    expand: true,
                    dot: true,
                    cwd: 'bower_components/font-awesome/fonts',
                    src: ['*.*'],
                    dest: 'assets/fonts'
                }]
            },

            docs: {
                files: [{
                    expand: true,
                    src: ['docs/**/*'],
                    dest: 'dist/'
                }]
            }
        },

        /*
        |----------------------------------------------------------
        | CSS Min
        |----------------------------------------------------------
        */
        cssmin: {
            dist: {
                options: {
                    keepSpecialComments: 1
                },
                files: {
                    'dist/style.css': ['dist/style.css']
                }
            }
        },

        /*
        |----------------------------------------------------------
        | JS Uglify
        |----------------------------------------------------------
        */
        uglify: {
            options: {
                mangle: false
            },

            dist: {
                files: {
                    'dist/assets/javascripts/main.js': ['dist/assets/javascripts/main.js']
                }
            }
        },

        /*
        |----------------------------------------------------------
        | FTP Deploy
        |----------------------------------------------------------
        */
        'ftp-deploy': {
            live: {
                auth: {
                    host: '<%= build.options.ftp.live.host %>',
                    port: '<%= build.options.ftp.live.port %>',
                    username: "<%= build.options.ftp.live.username %>",
                    password: "<%= build.options.ftp.live.password %>"
                },
                src: './',
                dest: './',
                exclusions: build.options.ftp.exclude
            },

            staging: {
                auth: {
                    host: '<%= build.options.ftp.staging.host %>',
                    port: '<%= build.options.ftp.staging.port %>',
                    username: "<%= build.options.ftp.staging.username %>",
                    password: "<%= build.options.ftp.staging.password %>"
                },
                src: './',
                dest: './',
                exclusions: build.options.ftp.exclude
            }
        },

        /*
        |----------------------------------------------------------
        | Git revision
        |----------------------------------------------------------
        |
        | A short version of git revision is attached to compiled files
        |
        */
        revision: {
            options: {
                property: 'meta.revision',
                ref: 'HEAD',
                short: true
            }
        },

        /*
        |----------------------------------------------------------
        | Banner
        |----------------------------------------------------------
        */
        usebanner: {
            compiled: {
                options: {
                    position: 'bottom',
                    banner: '/* <%= grunt.template.today("yyyy-mm-dd HH:ss") %> @ ' + themeData.name + ' v' + themeData.version + ' (<%= meta.revision %>) */'
                },
                files: {
                    src: ['dist/style.css', 'dist/assets/javascripts/*.js']
                }
            }
        },


        /*
        |----------------------------------------------------------
        | Compress
        |----------------------------------------------------------
        */
        compress: {
            main: {
                options: {
                    archive: themeData.name + '-' + themeData.version + '.zip'
                },
                expand: true,
                cwd: 'dist',
                src: ['**']
            }
        },

        /*
        |----------------------------------------------------------
        | Parker
        |----------------------------------------------------------
        */
        parker: {
            options: {
                file: 'dist/parker.md'
            },
            src: ['dist/style.css']
        },

        docker: {
            app: {
                src: [
                    'assets/**/*',
                    '*.php'
                ],
                dest: 'docs'
            }
        },

        removelogging: {
            dist: {
                src: 'dist/assets/javascripts/main.js',
                dest: 'dist/assets/javascripts/main.js'
            }
        },

        autoprefixer: {
            dev: {
                src: 'style.css',
                dest: 'style.css'
            },

            sass: {
                src: '.tmp/assets/stylesheets/additional.css'
            }
        },

        imagemin: {
            dev: {
                options: build.options.imagemin,
                files: [{
                    expand: true,
                    cwd: 'assets/images',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: '.tmp/assets/images'
                }]
            }
        }
    });

    // Forcing grunt to continue on warnings or errors; otherwise it would
    // exit on linting errors.
    grunt.option('force', true);

    // Enable OS notifications
    grunt.loadNpmTasks('grunt-notify');


    /*
    |----------------------------------------------------------
    | Tasks
    |----------------------------------------------------------
    */

    grunt.registerTask('minify', [
        'cssmin:dist',
        'uglify:dist'
    ]);

    grunt.registerTask('init', [
        'clean:.tmp',

        'shell:bower_prune',
        'shell:bower',
        'bower_concat',

        'csslint',
        'scsslint',
        'sass',

        'concat:js',
        'jshint'
    ]);

    // ### Zip the theme
    //
    // This task is mainly for distributing the theme on WordPress.org. It
    // doesn't run any build task before compressing, this has to be done
    // manually (for now).
    grunt.registerTask('zip', ['compress']);

    // ### Add a banner at the bottom of compiled files in <date>@<revision> format
    //
    // This shouldn't be called directly since other tasks automatically
    // call this task.
    grunt.registerTask('addbanner', [
        'revision',
        'usebanner:compiled'
    ]);

    // ### Validation
    //
    // Validates CSS, SASS and JS
    grunt.registerTask('validate', [
        'csslint',
        'scsslint',
        'jshint'
    ]);

    // ### Build the theme
    var buildTasks = [];

    buildTasks.push('init');
    if( ! grunt.option('init')) {
        buildTasks.shift();

        buildTasks.push('validate');
        buildTasks.push('clean:dist');
    }

    buildTasks.push('clean:dist');
    buildTasks.push('copy:dist');
    buildTasks.push('concat:css_dist');
    buildTasks.push('autoprefixer');
    buildTasks.push('removelogging');

    // WordPress.org doesn't allow minified styles or js files.
    if(grunt.option('minify')) {
        buildTasks.push('cssmin:dist');
        buildTasks.push('uglify:dist');
    }

    if(grunt.option('docs')) {
        buildTasks.push('parker');
        buildTasks.push('docker');
        buildTasks.push('copy:docs');
    }

    buildTasks.push('addbanner');

    if(grunt.option('zip')) {
        buildTasks.push('compress');
    }

    grunt.registerTask('build', buildTasks);

    // ### Default
    //
    // Builds the theme and watches for changes
    grunt.registerTask('default', [
        'browserSync',
        'watch'
    ]);
}
