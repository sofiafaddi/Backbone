module.exports = function(grunt) {
	grunt.initConfig({

		express: {
			build: {
				options : {
					server: ('controllers/controller.js')
				}
			}	
		},
        jshint: {
			files: ['Gruntfile.js', 'controllers/controller.js', 'shared/annuaire.js'],
			options: {
				globals: {
					jQuery: true
				}
			}
		},
        less: {
            development: {
                options: {
                    paths: ["public/less"],
                    yuicompress: true
                },
                files: {
                    "public/style/style.css": "public/less/style.less",
                    "public/style/print.css" : "public/less/print.less"
                }
            }
        },
        watch: {
            files: "./pubic/less/*",
            tasks: ["less"]
        }
	});

	grunt.registerTask('build', ['less', 'jshint', 'express', 'express-keepalive']);
	grunt.loadNpmTasks('grunt-express');
	grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

};