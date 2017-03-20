'use strict';
const gulp = require('gulp');
const rimraf = require('gulp-rimraf');
const tslint = require('gulp-tslint');
const mocha = require('gulp-mocha');
const shell = require('gulp-shell');
const env = require('gulp-env');
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var outDir = 'dist';

/**
 * Remove dist directory.
 */
gulp.task('clean', function () {
  return gulp.src(outDir, { read: false })
    .pipe(rimraf());
});

/**
 * Copy config files
 */
gulp.task('configs', (cb) => {
  return gulp.src("src/configurations/*.json")
    .pipe(gulp.dest('./dist/configurations'));
});

/**
 * Watch for changes in TypeScript
 */
gulp.task('watch', shell.task([
  'npm run tsc-watch',
]))

/**
 * Lint all custom TypeScript files.
 */
gulp.task('tslint', () => {
  return gulp.src('src/**/*.ts')
    .pipe(tslint({formatter: "prose"}))
    .pipe(tslint.report());
});

gulp.task('compile', shell.task([
  'npm run tsc',
]))

/**
 * Build the project.
 */
gulp.task('build', ['tslint', 'compile', 'configs'], () => {
  console.log('Building the project ...');

  return gulp.src('src/**/*.ts')
    .pipe(tsProject())
    .js.pipe(gulp.dest("dist"));
});

/**
 * Run tests.
 */
gulp.task('test', ['build'], (cb) => {
  const envs = env.set({
    NODE_ENV: 'test'
  });

  gulp.src(['build/test/**/*.js'])
    .pipe(envs)
    .pipe(mocha())
    .once('error', (error) => {
      console.log(error);
      process.exit(1);
    })
    .once('end', () => {
      process.exit();
    });
});

gulp.task('default', ['build']);
