module.exports = function (grunt) {
// npm i -D grunt grunt-autoprefixer grunt-concurrent grunt-contrib-clean grunt-contrib-concat grunt-contrib-connect grunt-contrib-copy grunt-contrib-csslint grunt-contrib-cssmin grunt-contrib-imagemin grunt-contrib-jshint grunt-contrib-less grunt-contrib-uglify grunt-contrib-watch grunt-include-replace grunt-newer grunt-notify grunt-prettify grunt-usemin grunt-wiredep jshint-stylish load-grunt-tasks time-grunt 

    'use strict';

    // 작업시간 표시
    require('time-grunt')(grunt);

    // 자동으로 grunt 태스크를 로드합니다. grunt.loadNpmTasks 를 생략한다.
    // require('load-grunt-tasks')(grunt);
    require('jit-grunt')(grunt);

    // var config = {
    //     less: {
    //         src: 'src/less/style.less',
    //         dest: 'dest/css/style.css'
    //     }
    // };

    var config = grunt.file.readJSON('grunt/config.json');
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: config,

        clean: {
            dist: {
                files: [{
                dot: true,
                nonull: true,
                src: [
                    'dest'
                    ]
                }]
            },
        },

        // html 에서 인클루드를 사용합니다.
        includes: {
            dist: {
                
                expand: true,
                cwd: 'src/docs/html/',
                src: ['**/*.html'],
                dest: 'dest',
                options: {
                    flatten: true,
                    // debug: true,
                    includePath: 'src/docs/include/'
                }
            }
        },
        // html 구문검사를 합니다.
        htmlhint: {
            options: {
                htmlhintrc: 'grunt/.htmlhintrc'
            },
            dist: [
                'dest/**/*.html',
                // 'src/docs/html/**/*.html',
                // '!src/docs/include/**/*.html'
            ]
        },
        

        // less 를 css 로 변환합니다.
        less: {
            options: {
                banner: '<%= banner %>',
                dumpLineNumbers : 'comments'
            },
            dist: {
                src: config.css.src,
                dest: config.css.dest
            }
        },
        // sass 를 css 로 변환합니다.
        // grunt-sass 는 루비를 설치하지 않아도 사용할수 있습니다.
        // https://www.npmjs.com/package/grunt-sass
        // https://github.com/sass/node-sass
        sass: {
            // options: {
            //     // sourceMap: false,
            //     // outFile: false,
            //     // outputStyle: 'expanded' // nested, expanded, compact, compressed
            // },
            dist: {
                expand: true,
                cwd: 'src/sass/',
                // src: ['*.scss','*.sass'],
                src: ['*.scss'],
                dest: 'dest/css/',
                ext: '.css'
            }
        },
        postcss: {
            sassPost: {
                options: {
                    processors: [
                        require('autoprefixer')({
                            browsers: [
                                'Android 2.3',
                                'Android >= 4',
                                'Chrome >= 35',
                                'Firefox >= 31',
                                'Explorer >= 9',
                                'iOS >= 7',
                                'Opera >= 12',
                                'Safari >= 7.1'
                            ]
                        })
                    ]
                },
                dist: {
                    expand: true,
                    cwd: 'dest/css',
                    src: ['*.css'],
                    dest: 'dest/css',
                    ext: '.css'
                }
            },
            prePost: {
                options: {
                    parser: require('postcss-scss'),
                    processors: [
                        require('precss')({ /* options */ }),
                        require('autoprefixer')({
                            browsers: [
                                'Android 2.3',
                                'Android >= 4',
                                'Chrome >= 35',
                                'Firefox >= 31',
                                'Explorer >= 9',
                                'iOS >= 7',
                                'Opera >= 12',
                                'Safari >= 7.1'
                            ]
                        })
                    ]
                },
                dist: {
                    expand: true,
                    cwd: 'src/css',
                    src: ['*.css'],
                    dest: 'dest/css',
                    ext: '.css'
                }
            }
        },
        // css 구문검사를 합니다.
        csslint: {
            options: {
                csslintrc: 'grunt/.csslintrc'
            },
            dist: {
                src: config.css.dest
            }
        },
        // css 의 속성을 정렬해줍니다.
        csscomb: {
            options: {
                config: 'grunt/.csscomb.json'
            },
            dist: {
                // src: config.css.dest
                // dest: config.css.dest
                expand: true,
                cwd: 'dest/css',
                src: ['*.css'],
                dest: 'dest/css',
                ext: '.css'
            }
        },
        // css 를 압축합니다.
        cssmin: {
            options: {
                // TODO: disable `zeroUnits` optimization once clean-css 3.2 is released
                //    and then simplify the fix for https://github.com/twbs/bootstrap/issues/14837 accordingly
                compatibility: 'ie8',
                keepSpecialComments: '*',
                // sourceMap: true,
                noAdvanced: true
                // compatibility: 'ie8',
                // default - '!'가 붙은 주석은 보존,
                // 1 - '!'가 붙은 주석 중 첫번째 주석만 보존
                // 0 - 모든 주석 제거
                // noAdvanced: true,
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'dest/css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'dest/css',
                    ext: '.min.css'
                }]
            }
        },

        // 자바스크립트 구문검사를 합니다.
        jshint: {
            options: {
                jshintrc: 'grunt/.jshintrc',
                // force: true, // error 검출시 task를 fail 시키지 않고 계속 진단
                reporter: require('jshint-stylish') // output을 수정 할 수 있는 옵션
            },
            grunt: {
                src: ['Gruntfile.js']
            },
            dist: {
                src: 'app/js/site/*.js'
            }
        },

        concat: {
            options: {
                separator: ';'
            //     banner: '<%= banner %>'
            },
            dist: {
                src: 'app/js/site/*.js',
                dest: 'dist/js/site.js'
            }
        },

        uglify: {
            options: {
            //     banner: '<%= banner %>'
            //     banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                src: 'dist/js/site.js',
                dest: 'dist/js/site.min.js'
            }
        },

    });

    // 작업을 로드합니다.
    // grunt.loadNpmTasks('grunt-contrib-jshint');

    // html task
    grunt.registerTask('html', [
            'includes',
            'htmlhint'
        ]
    );

    // css task
    // (function (sassCompilerName) {
    //   require('./grunt/sass-compile/' + sassCompilerName + '.js')(grunt);
    // })(process.env.SASS || 'libsass');
    // grunt.registerTask('sass-compile', ['sass']);

    grunt.registerTask('sassPost', [
            'sass',
            'postcss:sassPost'
        ]
    );
    grunt.registerTask('precssPost', [
            'postcss:prePost'
        ]
    );
    grunt.registerTask('pcss', [
            'clean',
            // 'precss',
            'postcss'
        ]
    );

    grunt.registerTask('css', [
            'clean',
            // 'less',
            'sass',
            'postcss',
            'csslint',
            // 'autoprefixer',
            'csscomb',
            'cssmin'
        ]
    );

    // javascript task
    grunt.registerTask('javascript', [
            'jshint',
            'concat',
            'uglify'
        ]
    );

    grunt.registerTask('default', [
        'clean',
        'html',
        'css',
        'javascript',
    ]);


};
