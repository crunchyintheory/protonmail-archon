const gulp = require('gulp');
const sass = require('gulp-sass');
const git = require('gulp-git');
const minify = require('gulp-minify-css');
const rename = require('gulp-rename');
const fs = require('fs');

gulp.task('sass', function() {
    var css = gulp.src('./archon.scss')
        .pipe(sass().on('error', sass.logError));
    css.pipe(gulp.dest('./dist'));
    return css.pipe(minify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('build-update', function() {
    const config = fs.readFileSync('./archon.scss',{encoding: 'utf8'});
    const version = config.match(/\$version: '(.+)';/)[1];
    console.log(`Building output for ${version}`);
    git.checkout('gh-pages', (err) => {
        if(err) console.error(err);
        else {
            const lastVersion = fs.readFileSync('./LASTVER',{encoding: 'utf8'});
            if(lastVersion != version) {
                fs.mkdirSync(`./${version}`);
                fs.copyFileSync('./blank.svg', `./${version}/update.svg`);
                fs.copyFileSync('./update.svg', `./${lastVersion}/update.svg`);
                fs.writeFileSync('./LASTVER', version);
                gulp.src(['./**/*.svg', './LASTVER'])
                    .pipe(git.add())
                    .pipe(git.commit(`Update to ${version} from ${lastVersion}`));
            }
            else {
                console.log(`Already on ${version}`);
            }
            git.checkout('master');
        }
    });
});

gulp.task('default', ['sass']);