const buildDir = './dist';

module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    copy: {
      build: {
        files: [
          {
            expand: true,
            cwd: './src/configurations',
            src: ['**'],
            dest: buildDir + '/configurations'
          },
          {
            expand: true,
            cwd: "./private",
            src: ["**"],
            dest: "./dist/private"
          },
          {
            expand: true,
            cwd: "./public",
            src: ["**"],
            dest: "./dist/public"
          },
          {
            expand: true,
            cwd: "./views",
            src: ["**"],
            dest: "./dist/views"
          }
        ]
      }
    },
    ts: {
      default: {
        tsconfig: './tsconfig.json',
      },
      app: {
        files: [{
          src: ["src/\*\*/\*.ts", "!src/.baseDir.ts"],
          dest: "./dist"
        }],
        options: {
          module: "commonjs",
          target: "es2015",
          sourceMap: false
        }
      }
    },
    watch: {
      ts: {
        files: ["src/\*\*/\*.ts"],
        tasks: ["ts"]
      },
      views: {
        files: ["views/**/*.pug"],
        tasks: ["copy"]
      }
    },
    clean: [buildDir]
  });

  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-clean");  
  grunt.loadNpmTasks("grunt-ts");

  grunt.registerTask("default", [
    "clean",
    "copy",
    "ts"
  ]);

};
