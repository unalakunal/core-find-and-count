import config from '../config.js';
import gulp from 'gulp';
import util from 'gulp-util';

gulp.task('i18n_img:dev', () => {
    return gulp.src(config.paths.src.i18n_img)
        .pipe(gulp.dest(config.paths.builds.dev.i18n))
        .on('error', util.log);
});
