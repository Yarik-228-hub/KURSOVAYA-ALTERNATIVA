import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import postcssPresetEnv from 'postcss-preset-env';
import cleanCSS from 'gulp-clean-css';
import rename from 'gulp-rename';
import concat from 'gulp-concat';
import browserSync from 'browser-sync';
import del from 'del';
import fileInclude from 'gulp-file-include';

const sass = gulpSass(dartSass);
const bs = browserSync.create();

const paths = {
  html: {
    src: 'src/*.html',
    dest: 'dist/'
  },
  styles: {
    src: 'src/scss/**/*.scss',
    dest: 'dist/css/'
  },
  scripts: {
    src: 'src/js/**/*.js',
    dest: 'dist/js/'
  },
  images: {
    src: 'src/assets/images/**/*',
    dest: 'dist/assets/images/'
  },
  fonts: {
    src: 'src/assets/fonts/**/*',
    dest: 'dist/assets/fonts/'
  }
};

export const clean = () => del(['dist']);

export function html() {
  return gulp.src(paths.html.src)
    .pipe(fileInclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(bs.stream());
}

export function styles() {
  return gulp.src('src/scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([postcssPresetEnv({ stage: 1 })]))
    .pipe(cleanCSS({level: 2}))
    .pipe(rename({ basename: 'main' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(bs.stream());
}

export function scripts() {
  return gulp.src(paths.scripts.src)
    .pipe(concat('main.js'))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(bs.stream());
}

export function images() {
  return gulp.src(paths.images.src)
    .pipe(gulp.dest(paths.images.dest));
}

export function fonts() {
  return gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest));
}

export function serve() {
  bs.init({
    server: { baseDir: 'dist' },
    notify: false
  });

  gulp.watch('src/partials/**/*.html', html);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.images.src, images).on('change', bs.reload);
}

export const build = gulp.series(clean, gulp.parallel(html, styles, scripts, images, fonts));
export default gulp.series(build, serve);

gulp.task('scripts', () => {
  return gulp.src([
    'node_modules/micromodal/dist/micromodal.min.js',
    'src/js/main.js'
  ])
  .pipe(concat('main.js'))
  .pipe(gulp.dest('dist/js'));
});