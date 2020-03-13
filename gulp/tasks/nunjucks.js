import gulp from 'gulp';
import nunjucksRender from 'gulp-nunjucks-render';
import plumber from 'gulp-plumber';
import gulpif from 'gulp-if';
import changed from 'gulp-changed';
import prettify from 'gulp-prettify';
import frontMatter from 'gulp-front-matter';
import data  from 'gulp-data';
import rename from 'gulp-rename';

import { join, basename } from 'path';
import { lstatSync, readdirSync, readFileSync } from 'fs';

import config from '../config';

const isDirectory = source => lstatSync(source).isDirectory()
const getDirectoriesNames = source =>
  readdirSync(source).map(name => name)

const renderHtml = (onlyChanged) => {
  nunjucksRender.nunjucks.configure({
    watch: false,
    trimBlocks: true,
    lstripBlocks: false,
  });

  getDirectoriesNames(config.src.contentData).forEach(dir => {
    return gulp
      .src([`${config.src.templates}/**/[^_]*.html`])
      .pipe(plumber({
        errorHandler: config.errorHandler,
      }))
      .pipe(gulpif(onlyChanged, changed(config.dest.html)))
      .pipe(frontMatter({ property: 'data' }))

      .pipe(data(file => {
            const globalData = JSON.parse(readFileSync(`${config.src.contentData}/${dir}/global.json`));
            const filename = basename(file.path);
            const jsonname = filename.slice(0,-5);
            
            // const current = JSON.parse(readFileSync(`${config.src.contentData}/${dir}/${jsonname}.json`));
            // const langdata = current ? { ...globalData, ...current } : globalData
            // console.log(langdata);
            // return langdata;

            return globalData;
        }))

      .pipe(nunjucksRender({
        PRODUCTION: config.production,
        path: [config.src.templates],
      }))
      .pipe(prettify({
        indent_size: 2,
        wrap_attributes: 'auto', // 'force'
        preserve_newlines: false,
        // unformatted: [],
        end_with_newline: true,
      }))
      .pipe(rename({
        suffix: `-${dir}`
      }))
      .pipe(gulp.dest(`${config.dest.html}`));

    })
};

gulp.task('nunjucks', (done) => {
  renderHtml();
  done();
});
gulp.task('nunjucks:changed', (done) => {
  renderHtml(true);
  done();
});

const build = (gulp) => gulp.parallel('nunjucks');
const watch = (gulp) => function () {
  gulp.watch([
    `${config.src.templates}/**/[^_]*.html`,
  ], gulp.parallel('nunjucks:changed'));

  gulp.watch([
    `${config.src.templates}/**/_*.html`,
  ], gulp.parallel('nunjucks'));
};

module.exports.build = build;
module.exports.watch = watch;
