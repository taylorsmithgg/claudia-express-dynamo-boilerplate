'use strict';
const gulp = require('gulp');
const rimraf = require('gulp-rimraf');
const tslint = require('gulp-tslint');
const mocha = require('gulp-mocha');
const shell = require('gulp-shell');
const env = require('gulp-env');
const ts = require("gulp-typescript");
const webpack = require('./gulp/webpack');
const gutil = require('gulp-util');

const tsProject = ts.createProject("tsconfig.json");

const outDir = 'dist';
const srcDir = 'src';

/**
 * Set environment
 */
gulp.task('env', ['clean'], () => {
  const envs = env.set({
    NODE_ENV: 'dev'
  });

  if(process.env.NODE_ENV !== 'production'){
    return gulp.src('webpack.config.js')
      .pipe(gulp.dest(outDir));
  }
});

/**
 * Webpack bundle
 */
gulp.task('webpack', ['build'], function(done) {
  webpack.build().then(function() { done(); });
});

/**
 * Remove dist directory.
 */
gulp.task('clean', () => {
  return gulp.src(outDir, { read: false }).pipe(rimraf());
});

/**
 * Copy config files
 */
gulp.task('configs', ['clean'], (cb) => {
  return gulp.src(`${srcDir}/configurations/*.json`)
    .pipe(gulp.dest(`${outDir}/configurations`));
});

/**
 * Copy views
 */
gulp.task('views', ['clean'], (cb) => {
  return gulp.src(`views/**`)
    .pipe(gulp.dest(`${outDir}/views`));
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
  return gulp.src(`${srcDir}/**/*.ts`)
    .pipe(tslint({formatter: "prose"}))
    .pipe(tslint.report());
});

/**
 * Compile typescript files
 */
gulp.task('ts', ['tslint', 'clean'], () => {
  return gulp.src(`${srcDir}/**/*.ts`)
    .pipe(tsProject())
    .js
    .pipe(gulp.dest(outDir));
});

/**
 * Build the project.
 */
gulp.task('build', ['clean', 'env', 'ts', 'configs', 'views'], () => {
  return gulp.src(`${srcDir}/**/*.js`)  
    .pipe(gulp.dest(outDir));
});

/**
 * Run tests.
 */
gulp.task('test', ['build'], (cb) => {
  const envs = env.set({
    NODE_ENV: 'test'
  });

  gulp.src([`${outDir}/test/**/*.js`])
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

gulp.task('default', ['clean', 'build']);
