module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-githooks');

  grunt.loadNpmTasks('grunt-contrib-connect');grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    requirejs: {
      compile: {
        options: {
          baseUrl: 'app/js/app',
          mainConfigFile: 'app/js/main.js',
          out: "app/js/build/app.min.js",
          name: "../main"
        }
      }
    },
    githooks: {
      all: {
        'pre-commit': 'jshint',
        'post-merge': 'bower'
      }
    },
    jshint: {
      options: {
        camelcase: true,
        curly: true,
        eqeqeq: true,
        indent: 2,
        nonew: true,
        quotmark: 'single',
        strict: true,
        trailing: true,
        white: true,
        ignores: ['Gruntfile.js', 'app/js/lib', 'app/js/build']
      },
      all: ['app/js']
    },
    connect: {
      server: {
        options: {
          keepalive: true,
          hostname: '127.0.0.1',
          port: 8080,
          useAvailablePort: true,
          open: true,
          base: 'app'
        }
      }
    },
    bower: {
      install: {
        options: {
          targetDir: 'app/js/lib'
        }
      }
    }
  });
  
  grunt.registerTask('build', ['jshint', 'requirejs']);
  grunt.registerTask('install', ['githooks', 'bower', 'connect']);
};
