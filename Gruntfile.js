let sass = require('sass')
let package = require('./package.json')

module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		projectHeader: '/* \n' +
			'   Plugin Name: <%= pkg.config.project %>\n' +
			'   Plugin URI: <%= pkg.config.url %>\n' +
			'   Author: <%= pkg.author.name %>\n' +
			'   Author URI: <%= pkg.author.url %>\n' +
			'   Version: <%= pkg.version %>\n' +
			'*/\n\n',
		'dart-sass': {
			project: {
				options: {
					sourceMap: true
				},
				files: {
					'./dist/css/style.css': './src/scss/style.scss',
				}
			}
		},
		usebanner: {
			project: {
				options: {
					position: 'top',
					banner: '<%= projectHeader %>',
					linebreak: true,
				},
				files: {
					src: ['<%= pkg.config.target %>']
				}
			}
		},

		watch: {
			sass: {
				files: ['./**/*.scss', '!./node_modules/**/*.scss'],
				tasks: ['dart-sass'],
			},
		},
	})

	grunt.loadNpmTasks('grunt-banner')
	grunt.loadNpmTasks('grunt-contrib-watch')
	grunt.loadNpmTasks('grunt-dart-sass')
	grunt.loadNpmTasks('grunt-browser-sync')
	grunt.loadNpmTasks('grunt-concurrent')
	grunt.loadNpmTasks('grunt-contrib-uglify')
	grunt.loadNpmTasks('grunt-browserify')


	//grunt.registerTask('default', ['browserSync', 'concurrent:project'])
	grunt.registerTask('default', ['browserSync', 'watch'])
}