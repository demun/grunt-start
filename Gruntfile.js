module.exports = function (grunt) {
// npm i -D grunt grunt-autoprefixer grunt-concurrent grunt-contrib-clean grunt-contrib-concat grunt-contrib-connect grunt-contrib-copy grunt-contrib-csslint grunt-contrib-cssmin grunt-contrib-imagemin grunt-contrib-jshint grunt-contrib-less grunt-contrib-uglify grunt-contrib-watch grunt-include-replace grunt-newer grunt-notify grunt-prettify grunt-usemin grunt-wiredep jshint-stylish load-grunt-tasks time-grunt 

    'use strict';

    // 작업시간 표시
    require('time-grunt')(grunt);

    // 자동으로 grunt 태스크를 로드합니다. grunt.loadNpmTasks 를 생략한다.
    // require('load-grunt-tasks')(grunt);
    require('jit-grunt')(grunt, {
        useminPrepare: 'grunt-usemin'
    });
    // require('jit-grunt')(grunt);

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
                src: ['dest']
                }]
            },
            sass: {
                files: [{
                dot: true,
                nonull: true,
                src: ['src/css/sass']
                }]
            },
            cssnext: {
                files: [{
                dot: true,
                nonull: true,
                src: ['src/css/cssnext-result']
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
        cssnext: {
            options: {
                sourcemap: true
            },
            dist: {
                // src: 'src/css/cssnext/cssnext.css',
                // dest: 'src/css/cssnext-result/cssnext.css'

                expand: true,
                cwd: 'src/css/cssnext',
                src: ['*.css'],
                dest: 'src/css/cssnext-result',
                ext: '.css'
            }
        },
        // sass 를 css 로 변환합니다.
        // grunt-sass 는 루비를 설치하지 않아도 사용할수 있습니다.
        // sass + postcss:sass
        sass: {
            options: {
                // sourceMap: false,
                // outFile: false,
                outputStyle: 'expanded' // nested, expanded, compact, compressed
            },
            dist: {
                expand: true,
                cwd: 'src/sass/',
                src: ['*.scss','*.sass'],
                dest: 'src/css/sass/',
                ext: '.css'
            }
        },
        postcss: {
            // autoprefixer
            sass: {
                options: {
                    processors: [
                        require('autoprefixer')({
                            browsers: ['last 2 versions']
                        })
                    ]
                },
                dist: {
                    src: 'src/css/sass/*.css'
                }
            },
            // sass 를 설치하지않고, postcss 의 모듈인 precss를 사용해서 sass 구문을 사용
            precss: {
                options: {
                    parser: require('postcss-scss'),
                    processors: [
                        // require('autoprefixer')({
                        //     browsers: ['last 2 versions']
                        // }),
                        require('precss')({ /* options */ })
                    ]
                },
                dist: {
                    // expand: true,
                    // cwd: 'src/sass/',
                    // src: ['*.scss','*.sass'],
                    // dest: 'src/css/sass/',
                    // ext: '.css'
                    src: 'src/css/precss/precss.css',
                    dest: 'src/css/precss-result/precss.css'
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

        coffee: {
            dist: {
                src: 'src/coffee/test.coffee',
                dest: 'src/js/coffee/test.js'
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
                src: 'src/js/site/*.js'
            }
        },

        // js 를 검사합니다.
        eslint: {
            target: [
                'Gruntfile.js',
                'src/js/site/{,*/}*.js',
                '!src/lib/*'
            ]
        },
        // Compiles ES6 with Babel
        babel: {
            options: {
                sourceMap: true
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/js/site/',
                    src: '{,*/}*.js',
                    dest: 'src/js/site/',
                    ext: '.js'
                }]
            }
        },

        concat: {
            options: {
                separator: ';'
            //     banner: '<%= banner %>'
            },
            dist: {
                src: 'src/js/site/*.js',
                dest: 'dest/js/site.js'
            }
        },

        uglify: {
            options: {
            //     banner: '<%= banner %>'
            //     banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                src: 'dest/js/site.js',
                dest: 'dest/js/site.min.js'
            }
        },

        watch: {
            options: { livereload: true },
            gruntfile: {
                files: ['Gruntfile.js'],
                tasks: ['jshint:grunt'],
                options: {
                    livereload: true
                }
            },
            // html: {
            //     files: ['src/docs/**/*.html'],
            //     tasks: ['useminPrepare','htmlhint:app','includes','usemin:dist:html'],
            //     options: {
            //         livereload: true,
            //     }
            // },
            cssnext: {
                files: ['src/css/cssnext/cssnext.css'],
                tasks: ['cssnext'],
                
            },
            sass: {
                files: ['src/sass/**/*.{scss,scss}'],
                tasks: ['sass', 'postcss:sass'],
                
            },
            precss: {
                files: ['src/css/precss/**/*.css'],
                tasks: ['postcss:precss'],
                
            },
            js: {
                files: [
                    'src/js/**/*.js'
                ],
                tasks: ['jshint','concat','uglify'],
                
            },
            // img: {
            //     files: ['src/images/**/*.{gif,jpeg,jpg,png}'],
            //     tasks: ['imagemin'],
            // },
            // md: {
            //     files: ['src/docs/guide/markdown/**/*.md'],
            //     tasks: ['markdown'],
            // },
        },
        connect: {
            server: {
                options: {
                    port: 9000,
                    hostname: 'localhost',
                    livereload: 35729,
                    // keepalive: true,
                    base: 'dest',
                    open: 'http://<%= connect.server.options.hostname %>:<%= connect.server.options.port %>/test/index.html'
                }
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

    // 1. sass + postcss + autoprefixer
    grunt.registerTask('cssSass', [
            'clean:sass',
            'sass',
            'postcss:sass'
        ]
    );
    // 2. postcss-scss + postcss + autoprefixer
    grunt.registerTask('cssPre', [
            'clean:sass',
            'postcss:precss'
        ]
    );
    grunt.registerTask('cssNext', [
            'clean:cssnext',
            'cssnext'
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
    grunt.registerTask('jsnt', [
            'jshint',
            'concat',
            'uglify'
        ]
    );
    grunt.registerTask('esnt', [
            'eslint',
            'babel',
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
