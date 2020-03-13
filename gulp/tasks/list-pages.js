import gulp from 'gulp';
import consolidate from 'gulp-consolidate';

import { join } from 'path';
import { lstatSync, readdirSync } from 'fs';

import { src, dest } from '../config';

import 'require-yaml';

const isDirectory = source => lstatSync(source).isDirectory()
const getDirectoriesNames = source =>
  readdirSync(source).map(name => name)

const renderPages = () => {
  delete require.cache[require.resolve(`../../${src.pagelist}`)];


  const pages = require(`../../${src.pagelist}`);

  const allPages = getDirectoriesNames(src.contentData).map(dir => ({
      ...pages,
      lang: dir
  }))

  return gulp
    .src(`${__dirname}/index/index.html`)
    .pipe(consolidate('lodash', {
      pages: allPages,
    }))
    .pipe(gulp.dest(dest.html)); 
};

gulp.task('list-pages', (done) => {
  renderPages();
  done();
});

const build = (gulp) => gulp.parallel('list-pages');
const watch = (gulp) => () => gulp.watch(`${src.root}/*`, gulp.series('list-pages'));

module.exports.build = build;
module.exports.watch = watch;
