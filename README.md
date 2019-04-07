# gulp-js2flowchart
A very basic gulp plugin wrapper for [js2flowchart](https://github.com/Bogdan-Lyashenko/js-code-to-svg-flowchart).

# Usage

```js
const gulp = require('gulp');
const { plugin } = require('gulp-js2flowchart');
const rename = require('gulp-rename');

gulp.task('js-to-flow-chart', () => {
  return src('./src/fileSystem.js')
    .pipe(plugin())
    .pipe(rename((path) => {
      path.extname = '.svg';
    }))
    .pipe(dest('./output/'));
});
```

Refer to [examples/gulpfile.js](examples/gulpfile.js) for more usage examples.
