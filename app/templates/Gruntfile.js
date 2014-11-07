'use strict';

module.exports = function(grunt) {
	//Load assemble
	grunt.loadNpmTasks('assemble');

	// show elapsed time at the end
	require('time-grunt')(grunt);

	// project specific custom export for CMS integration
	require('./tasks/cms')(grunt);

	// load all grunt tasks
	require('load-grunt-tasks')(grunt);

	// grunt config
	grunt.initConfig({

		// configurable paths
		configs: {
			dist: 'dist',
			src: 'app',
			tmp: 'tmp'
		},

		watch: {
			compass: {
				files: ['<%= configs.src %>/assets/styles/**/*.scss'],
				tasks: ['compass:server', 'autoprefixer']
			},
			styles: {
			files: ['<%= configs.src %>/assets/styles/**/{,*/}*.css'],
				tasks: ['copy:styles', 'autoprefixer']
			},
			livereload: {
				options: {
					livereload: 35729
				},
				files: [
					'<%= configs.src %>/templates/**/*.hbs',
					'<%= configs.src %>/templates/helpers/*.js',
					'<%= configs.src %>/templates/data/*.{json,yml}',
					'{<%= configs.tmp %>,<%= configs.src %>}/assets/styles/{,*/}*.css',
					'{<%= configs.tmp %>,<%= configs.src %>}/assets/scripts/{,*/}*.js',
					'<%= configs.src %>/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
				],
				tasks: ['assemble']
			}
		},

		connect: {
			options: {
				port: 9000,
				livereload: 35729,
				// change this to '0.0.0.0' to access the server from outside
				hostname: '0.0.0.0'
			},
			livereload: {
				options: {
					open: true,
					base: [
						'<%= configs.tmp %>',
						'<%= configs.src %>'
					]
				}
			},
			dist: {
				options: {
					open: true,
					base: '<%= configs.dist %>'
				}
			}
		},

		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						'<%= configs.tmp %>',
						'<%= configs.dist %>/*',
						'!<%= configs.dist %>/.git*'
					]
				}]
			},
			server: '<%= configs.tmp %>',
			scripts: '<%= configs.tmp %>/assets/scripts/*'
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'Gruntfile.js',
				'<%= configs.src %>/assets/scripts/{,*/}*.js',
				'!<%= configs.src %>/assets/scripts/vendor/*'
			]
		},

		compass: {
			options: {
				sassDir: '<%= configs.src %>/assets/styles',
				cssDir: '<%= configs.tmp %>/assets/styles',
				generatedImagesDir: '<%= configs.tmp %>/assets/images/generated',
				imagesDir: '<%= configs.src %>/assets/images',
				javascriptsDir: '<%= configs.src %>/assets/scripts',
				fontsDir: '<%= configs.src %>/assets/fonts',
				importPath: './bower_components',
				httpImagesPath: '/assets/images',
				httpGeneratedImagesPath: '/assets/images/generated',
				httpFontsPath: '/assets/fonts',
				relativeAssets: false
			},
			dist: {
				options: {
					cssDir: '<%= configs.dist %>/assets/styles',
					generatedImagesDir: '<%= configs.dist %>/assets/images/generated'
				}
			},
			server: {
				options: {
					debugInfo: true
				}
			}
		},

		autoprefixer: {
			options: {
				browsers: ['last 2 versions']
			},
			dist: {
				files: [{
					expand: true,
					cwd: '<%= configs.tmp %>/assets/styles/',
					src: '{,*/}*.css',
					dest: '<%= configs.tmp %>/assets/styles/'
				}]
			}
		},

		// not used since Uglify task does concat,
		// but still available if needed
		/*concat: {
			dist: {}
		},*/

		rev: {
			dist: {
				files: {
					src: [
						'<%= configs.dist %>/assets/scripts/{,*/}*.js',
						'<%= configs.dist %>/assets/styles/{,*/}*.css',
						'<%= configs.dist %>/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
						'<%= configs.dist %>/assets/fonts/{,*/}*.*'
					]
				}
			}
		},

		useminPrepare: {
			options: {
				dest: '<%= configs.dist %>/site'
			},
			html: '<%= configs.tmp %>/index.html'
		},

		usemin: {
			options: {
				dirs: ['<%= configs.dist %>'],
				concat: 'generated'
			},
			html: ['<%= configs.dist %>/{,*/}*.html'],
			css: ['<%= configs.dist %>/assets/styles/{,*/}*.css']
		},

		imagemin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= configs.src %>/assets/images/**',
					src: '*.*',
					dest: '<%= configs.dist %>/assets/images'
				}]
			}
		},

		svgmin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= configs.src %>/assets/images',
					src: '{,*/}*.svg',
					dest: '<%= configs.dist %>/assets/images'
				}]
			}
		},

		cssmin: {
			// This task is pre-configured if you do not wish to use Usemin
			// blocks for your CSS. By default, the Usemin block from your
			// `index.html` will take care of minification, e.g.
			//
			//     <!-- build:css({<%= configs.tmp %>,src}) assets/styles/main.css -->
			//
		},

		htmlmin: {
			dist: {
				options: {
					removeCommentsFromCDATA: true,
					// https://github.com/yeoman/grunt-usemin/issues/44
					// collapseWhitespace: true,
					collapseBooleanAttributes: true,
					removeAttributeQuotes: false,
					removeRedundantAttributes: true,
					useShortDoctype: true,
					removeEmptyAttributes: true,
					removeOptionalTags: true
				},
				files: [{
					expand: true,
					cwd: '<%= configs.src %>',
					src: '*.html',
					dest: '<%= configs.dist %>'
				}]
			},
			deploy: {
				options: {
					collapseWhitespace: false
				},
				files: [{
					expand: true,
					cwd: '<%= configs.dist %>',
					src: '*.html',
					dest: '<%= configs.dist %>'
				}]
			}
		},

		// Put files not handled in other tasks here
		copy: {
			ci: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= configs.src %>',
					dest: '<%= configs.dist %>',
					src: [
						'*.{ico,png,txt}',
						'.htaccess',
						'assets/fonts/**',
						'assets/scripts/data/**'//,
						// 'templates/partials/components/search-result.hbs'
					]
				}]
			},
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= configs.src %>',
					dest: '<%= configs.dist %>',
					src: [
						'*.{ico,png,txt}',
						'.htaccess',
						'assets/images/**',
						'assets/fonts/**',
						'assets/scripts/data/**',
						'templates/partials/components/search-result.hbs'
					]
				}]
			},
			images: {
				expand: true,
				dot: true,
				cwd: '<%= configs.src %>/assets/images',
				dest: '<%= configs.dist %>/assets/images',
				src: '**'
			},
			fonts: {
				expand: true,
				dot: true,
				cwd: '<%= configs.src %>/assets/fonts',
				dest: '<%= configs.dist %>/assets/fonts',
				src: '{,*/}*.*'
			},
			scripts: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= configs.src %>/assets/scripts',
					dest: '<%= configs.tmp %>/assets/scripts/',
					src: '{,*/}*.js'
				}, {
					expand: true,
					dot: true,
					dest: '<%= configs.tmp %>',
					src: ['bower_components/**']
				}]
			}
		},

		modernizr: {
			devFile: 'bower_components/modernizr/modernizr.js',
			outputFile: '<%= configs.dist %>/assets/scripts/vendor/modernizr.js',
			files: [
				'<%= configs.dist %>/assets/scripts/{,*/}*.js',
				'<%= configs.dist %>/assets/styles/{,*/}*.css',
				'!<%= configs.dist %>/assets/scripts/vendor/*'
			],
			uglify: true
		},

		concurrent: {
			server: [
				'compass:server'
			],
			dist: [
				'compass:dist',
				'imagemin',
				'svgmin',
				'htmlmin:dist'
			],
			ci : [
				'compass:dist',
				'htmlmin:dist'
			]
		},

		assemble: {
			options: {
				flatten: true,
				layout: '<%= configs.src %>/templates/layouts/default.hbs',
				partials: ['<%= configs.src %>/templates/partials/**/*.hbs'],
				helpers: ['<%= configs.src %>/templates/helpers/*.js'],
				data: '<%= configs.src %>/templates/data/*.{json,.yml}'
			},
			pages: {
				files: {
					'<%= configs.tmp %>/': [
						'<%= configs.src %>/templates/pages/{,*/}*.hbs'
					]
				}
			}//,
			// dist: {
			// 	files: {
			// 		'<%= configs.dist %>/site/': [
			// 		'<%= configs.src %>/templates/pages/{,*/}*.hbs'
			// 		]
			// 	}
			// }
		},

		bower: {
			options: {
				exclude: ['modernizr']
			},
			all: {
				rjsConfig: '<%= configs.src %>/assets/scripts/main.js'
			}
		},

		prettify: {
	    	options: {},
			tmp: {
				expand: true,
				cwd: '<%= configs.tmp %>',
				ext: '.html',
				src: ['{,*/}*.html'],
				dest: '<%= configs.tmp %>'
			},
			cms: {
				expand: true,
				cwd: '<%= configs.dist %>/cms',
				ext: '.html',
				src: ['{,*/}*.html'],
				dest: '<%= configs.dist %>/cms'
			},
			site: {
				expand: true,
				cwd: '<%= configs.dist %>/site',
				ext: '.html',
				src: ['{,*/}*.html'],
				dest: '<%= configs.dist %>/site'
			}
		},

		cms: {
			build: {
				dist: "<%= configs.dist %>",
				dest: "<%= configs.dist %>/cms",
				templates: "<%= configs.src %>/templates",
				src: "<%= configs.tmp %>",
				mainCSS: "app.styles.css",
				mainJS: "app.main.js",
				module: {
					dirs:{
						markup: '<%= configs.src %>/templates/partials/modules/',
						scripts: '<%= configs.src %>/assets/scripts/'
					},
					layout:  '<%= configs.src %>/templates/layouts/cms.hbs',
					data:{
						// module-template: data-file.index
						// ex. "header-nav": globals.0
						"story-banner-homepage" : "modules_aem_main_story.0",
						"pull-quote" : "modules_aem_main_story.1",
						"main-story" : "modules_aem_main_story.2",
						"story-banner-standard" : "modules_aem_secondary_story.0",
						"secondary-story-text" : "modules_aem_secondary_story.1",
						"secondary-story-multimedia" : "modules_aem_secondary_story.2",
						"secondary-story-visual" : "modules_aem_secondary_story.3",
						"secondary-story-text-multimedia" : "modules_aem_secondary_story.4",
						"secondary-story-icons" : "modules_aem_secondary_story.5",
						"story-snippet-standard" : "modules_aem_story_snippet.1",
						"story-snippet-visual" : "modules_aem_story_snippet.2",
						"story-snippet-visual-text" : "modules_aem_story_snippet.3",
						"story-snippet-text" : "modules_aem_story_snippet.4",
						"story-snippet-cards" : "modules_aem_story_snippet.5",
						"story-aside-sidebar" : "modules_aem_story_snippet.6",
						"story-aside-related-content" : "modules_aem_story_snippet.7",
						"product-tiles-standard" : "modules_aem_product.1",
						"product-tiles-carousel" : "modules_aem_product.2",
						"product-aside" : "modules_aem_product.3",
						"product-related-documents" : "modules_aem_product.4",
						"product-tiles-visual" : "modules_aem_product.5",
						"product-description" : "modules_aem_product.6",
						"navigation-secondary" : "modules_aem_jobs_events.1",
						"jobs-aside" : "modules_aem_jobs_events.2",
						"events-aside" : "modules_aem_jobs_events.3",
						"events-tile" : "modules_aem_jobs_events.4",
						"open-module":[
							'modules_aem_jobs_events.5',
							'modules_aem_jobs_events.6'
						],
						"contact-module" : "modules_contact.2"
					}
				},
				globals: {
					scss: {
						dir: [
							'<%= configs.src %>/assets/styles/'
						],
						styles: [
							'<%= configs.src %>/assets/styles/globals/'
						]
					},
					scripts: {
						concat:{
							libs: [
								"<%= configs.tmp %>/bower_components/jquery/dist/jquery.js",
								"<%= configs.tmp %>/bower_components/modernizr/modernizr.js",
								"<%= configs.tmp %>/bower_components/slick-carousel/slick/slick.js"
							],

							main: []
						},
						modules: []
					},
					images: '<%= configs.src %>/assets/images/',
					fonts: '<%= configs.src %>/assets/fonts/'
				}
			}
		}
	});

	grunt.registerTask('serve', function(target) {
		if (target === 'dist') return grunt.task.run(['build', 'connect:dist:keepalive']);

		grunt.task.run([
			'clean:server',
			'assemble',
			'prettify',
			'concurrent:server',
			'autoprefixer',
			'copy:scripts',
			'connect:livereload',
			'watch'
		]);
	});

	grunt.registerTask('build', [
		'ci'
	]);

	grunt.registerTask('ci', [
		'clean:dist',
		'assemble',
		'prettify',
		'useminPrepare',
		'concurrent:ci',
		'copy:images',
		'copy:fonts',
		'autoprefixer',
		'copy:scripts',
		'concat',
		'uglify',
		'modernizr',
		'copy:ci',
		'usemin',
		'cms'
		//'cssmin'
	]);

	grunt.registerTask('default', [
		'jshint',
		'build'
	]);
};
