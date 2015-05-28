// Written by Kevin H <nehalist.io>
//
// "Your work is going to fill a large part of your life, and the only way to
// be truly satisfied is to do what you believe is great work. And the only way
// to do great work is to love what you do." - Steve Jobs

/* jshint ignore:start */

// TODO Add imgmin
// TODO Add autoprefix
// TODO Add brower sync

"use strict";

// Global configurations
// TODO Add more configurations.
var config = {
    ftp_exclusion : [
        '.sass-cache', '.git', 'bower_components', 'node_modules', '.csslintrc',
        '.ftpsrv.json', '.gitignore', '.jshintrc', '.scss-lint.yml',
        'bower.json', 'readme.md', 'Gruntfile.js', '.DS_Store', '._*',
        'Spotlight-V100', '.Trashes', 'Thumbs.db', 'npm-debug.log', '.settings',
        'nbproject', 'package.json', 'assets/stylesheets', 'assets/tmp',
        'assets/javascripts', '.banner'
    ]
}

// Needed for NodeJS
var path        = require('path');

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
        'shell': 'grunt-shell-spawn',
        'scsslint': 'grunt-scss-lint',
        'revision': 'grunt-git-revision',
        'usebanner': 'grunt-banner'
    });

    // Configure grunt
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        ftp: grunt.file.readJSON('.ftpsrv.json'),
        banner: grunt.file.read('.banner'),


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
            // PHP Files
            php: {
                files: [
                    '*.php',
                    'templates/*.php'
                ],
                options: {
                    livereload: true
                }
            },

            // BUILD FILES
            build_files: {
                files: [
                    'Gruntfile.js',
                    'package.json'
                ],
                tasks: ['default']
            },

            // BOWER COMPONENTS
            bower_components: {
                files: [
                    'bower.json'
                ],
                tasks: ['shell:bower_prune', 'shell:bower', 'bower_concat']
            },

            // SASS
            sass: {
                files: [
                    'assets/sass/*.{scss,sass}'
                ],
                tasks: ['scsslint', 'sass']
            },

            // JS FILES
            js: {
                files: [
                    'assets/javascripts/*.js'
                ],
                tasks: ['', 'concat:js', 'jshint']
            },

            // CSS FILES
            css: {
                files: [
                    'style.css'
                ],
                tasks: ['csslint']
            },

            // LIVERELOAD
            livereload: {
                files: [
                    'tmp/*.css',
                    'tmp/*.js',
                    'style.css'
                ],
                options: {
                    livereload: true
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
                dest: 'tmp/assets/vendor/vendor.js',
                cssDest: 'tmp/assets/vendor/vendor.css'
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
                    'tmp/assets/stylesheets/additional.css': 'assets/sass/base.scss'
                }
            }
        },


        /*
        |----------------------------------------------------------
        | SCSS Linting
        |----------------------------------------------------------
        */
        scsslint: {
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
                options: {
                    csslintrc: '.csslintrc'
                },

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
                dest: 'tmp/assets/javascripts/main.js'
            }
        },


        /*
        |----------------------------------------------------------
        | JSHint
        |----------------------------------------------------------
        */
        jshint: {
            dist: ['tmp/assets/javascripts/main.js']
        },


        /*
        |----------------------------------------------------------
        | Clean
        |----------------------------------------------------------
        */
        clean: {
            dist: {
                src: ['dist/*.css', '!dist/vendor.css']
            },

            tmp: {
                src: [
                    '!tmp/.gitignore',
                    'tmp/assets/*',
                    'tmp/*'
                ]
            },

            nonreleasefiles: {
                src: ['dist/*', '!dist/release.css', '!dist/release.js']
            }
        },

        copy: {
            dist: {
                files: [{
                    src: [
                        '*.php',
                        'templates/*.php',
                        'readme.md',
                        'readme.txt',
                        'license',
                        'screenshot.png',
                        'style.css',
                        'assets/**/*',
                        'libs/**/*'
                    ],
                    dest: 'dist/',
                    cwd: 'dist'
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
            }
        },

        /*
        |----------------------------------------------------------
        | CSS Min
        |----------------------------------------------------------
        */
        cssmin: {
            release: {
                files: {
                    'dist/release.css': [
                        'style.css',
                        'dist/additional.css',
                        'dist/vendor.css'
                    ]
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

            release: {
                files: {
                    'dist/release.js': ['dist/main.js', 'dist/vendor.js']
                }
            },

            test: {
                files: {
                    'dist/release.js': ['dist/main.js']
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
                    host: '<%= ftp.live.host %>',
                    port: '<%= ftp.live.port %>',
                    username: "<%= ftp.live.username %>",
                    password: "<%= ftp.live.password %>"
                },
                src: './',
                dest: './',
                exclusions: config.ftp_exlusion
            },

            staging: {
                auth: {
                    host: '<%= ftp.staging.host %>',
                    port: '<%= ftp.staging.port %>',
                    username: "<%= ftp.staging.username %>",
                    password: "<%= ftp.staging.password %>"
                },
                src: './',
                dest: './',
                exclusions: config.ftp_exclusion
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
                    src: ['dist/*']
                }
            },
            header: {
                options: {
                    position: 'top',
                    banner: '<%= banner %>'
                },
                files: {
                    src: ['dist/*']
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
                files: [
                    {
                        src: [
                            'assets/images/*',
                            'assets/fonts/*',
                            'assets/vendor/*'
                        ]
                    },
                    {
                        src: ['dist/*']
                    },
                    {
                        src: ['*.php', '*.css', '*.md', '*.txt', '*.png']
                    },
                    {
                        src: ['libs/*/*', 'libs/*.php']
                    }
                ]
            }
        },

        /*
        |----------------------------------------------------------
        | Parker
        |----------------------------------------------------------
        */
        parker: {
            options: {
                file: "parker.md"
            },
            src: [
                'dist/*.css',
                '*.css',
                '!dist/vendor.css'
            ]
        },

        docker: {
            app: {
                src: [
                    'assets/**/*',
                    '*.php'
                ],
                dest: 'docs'
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

    grunt.registerTask('init', [
        'clean:tmp',

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
    grunt.registerTask('zip', ['addbanner', 'compress']);

    // ### Add a banner at the bottom of compiled files in <date>@<revision> format
    //
    // This shouldn't be called directly since other tasks automatically
    // call this task.
    grunt.registerTask('addbanner', [
        'revision',
        'usebanner:header',
        'usebanner:compiled'
    ]);

    // ### Build the theme
    //
    // Calls a bunch of tasks to build the theme:
    // 1. Clean directories (tmp, dir)
    // 2. Install bower dependencies
    // 3. Lint CSS (style.css)
    // 4. Lint and compile SASS
    // 5. Lint and concat JS
    // 6. Clean tmp directory
    var buildTasks = [];
    buildTasks.push('watch');
    grunt.registerTask('build', buildTasks);

    // ### Build a release version of the theme
    //
    // This task automatically builds the theme and:
    // 1. Minify ALL css files
    // 2. Minify ALL js files
    // 3. Clean "non release files" (non minified files)
    // 4. Add release and header banner to files
    grunt.registerTask('release', [
        'build',
        'cssmin',
        'uglify:release',
        'clean:nonreleasefiles',
        'addbanner'
    ]);

    // ### Validation
    //
    // Validates CSS, SASS and JS
    grunt.registerTask('validate', [
        'csslint',
        'scsslint',
        'jshint'
    ]);

    // ### Default
    //
    // Builds the theme and watches for changes
    grunt.registerTask('default', [
        'watch'
    ]);
}
