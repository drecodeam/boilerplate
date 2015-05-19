// Written by Kevin H <nehalist.io>
//
// "Your work is going to fill a large part of your life, and the only way to
// be truly satisfied is to do what you believe is great work. And the only way
// to do great work is to love what you do." - Steve Jobs

"use strict";

// Global configurations
// TODO Add more configurations.
var config = {
    ftp_exclusion : [
        '.sass-cache', '.git', 'bower_components', 'node_modules', '.csslintrc',
        '.ftpsrv.json', '.gitignore', '.jscsrc', '.jshintrc', '.scss-lint.yml',
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
                    '*.php'
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
                tasks: ['shell', 'bower_concat']
            },

            // STYLESHEETS
            sass: {
                files: [
                    'assets/stylesheets/*.{scss,sass}'
                ],
                tasks: ['scsslint', 'concat:sass', 'sass']
            },

            // JS FILES
            js: {
                files: [
                    'assets/javascripts/*.js'
                ],
                tasks: ['jscs', 'concat:js', 'jshint']
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
                    'dist/*',
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
            }
        },

        // Concatenation of bower components
        bower_concat: {
            all: {
                dest: 'dist/vendor.js',
                cssDest: 'dist/vendor.css'
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
                    'dist/additional.css': 'assets/tmp/concatenated.scss'
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
                'assets/stylesheets/*.scss'
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
            sass: {
                src: ['assets/stylesheets/*.scss'],
                dest: 'assets/tmp/concatenated.scss'
            },

            js: {
                src: ['assets/javascripts/*.js'],
                dest: 'dist/main.js'
            }
        },


        /*
        |----------------------------------------------------------
        | JSHint
        |----------------------------------------------------------
        */
        jshint: {
            dist: ['dist/main.js']
        },


        /*
        |----------------------------------------------------------
        | JS Check Style (JSCS)
        |----------------------------------------------------------
        */
        jscs: {
            src: 'assets/javascripts/*.js'
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

            initial: {
                src: [
                    'dist/*',
                    '!dist/.gitkeep',
                    'assets/tmp/*',
                    '!assets/tmp/.gitkeep'
                ]
            },

            tmp: {
                src: ['assets/tmp/*', '!assets/tmp/.gitkeep']
            },

            nonreleasefiles: {
                src: ['dist/*', '!dist/release.css', '!dist/release.js']
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
    grunt.registerTask('build', [
        'clean:initial',
        'shell',
        'bower_concat',
        'csslint',
        'concat:sass',
        'scsslint',
        'sass',
        'jscs',
        'concat:js',
        'jshint',
        'clean:tmp',
        'parker'
    ]);

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
        'jscs',
        'jshint'
    ]);

    // ### Default
    //
    // Builds the theme and watches for changes
    grunt.registerTask('default', [
        'watch'
    ]);
}
