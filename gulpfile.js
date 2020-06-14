const fs = require("fs");
const { exec } = require('child_process');
const { parallel, src, series, dest, watch } = require('gulp');
const source = require('vinyl-source-stream');
const rollupStream = require('@rollup/stream');
const rollupTypescript = require('@rollup/plugin-typescript');
const rollupNodeResolve = require('@rollup/plugin-node-resolve').default;
const rollupCommonJs = require('@rollup/plugin-commonjs');
const rollupReplace = require('@rollup/plugin-replace');
const rollupTerser = require('rollup-plugin-terser').terser;

function cleanDistFolder(cb) {
  if (fs.existsSync('dist/')) {
    return exec('rm -r dist/');
  }
  cb();
}

function createDistFolder() {
  return exec('mkdir dist');
}

const rollupBuildConfig = {
  input: './src/main.ts',
  external: ['/node_modules/'],
  plugins: [
    rollupReplace({
        'typeof CANVAS_RENDERER': JSON.stringify(false),
        'typeof WEBGL_RENDERER': JSON.stringify(true),
        'typeof EXPERIMENTAL': JSON.stringify(true),
        'typeof PLUGIN_CAMERA3D': JSON.stringify(false),
        'typeof PLUGIN_FBINSTANT': JSON.stringify(false),
        'typeof FEATURE_SOUND': JSON.stringify(true)
    }),
    rollupNodeResolve({
        extensions: [ '.ts', '.tsx' ]
    }),
    rollupCommonJs(
      // сравнивал сборки, не заметил улучшений
      {
          include: [
              'node_modules/eventemitter3/**',
              'node_modules/phaser/**'
          ],
          exclude: [ 
              'node_modules/phaser/src/polyfills/requestAnimationFrame.js'
          ],
          sourceMap: false,
      }
    ),
    rollupTypescript(),
    rollupTerser()
  ]
};

const rollupWriteConfig = {
  // file: './dist/main.js',
  // format: 'umd',
  format: 'iife',
  name: 'uniteGame',
  // sourcemap: true
};

// async function buildScripts() {
//   const bundle = await rollup.rollup(rollupBuildConfig);

//   await bundle.write(rollupWriteConfig);
// }

function buildScripts() {
  return rollupStream({
    ...rollupBuildConfig,
    output: rollupWriteConfig,
  })
  .pipe(source('main.js'))
  // .pipe(terser({keep_fnames: true, mangle: false}))
  .pipe(dest('dist'));
}

function copyAssets () {
  return src('public/**/*')
  .pipe(dest('dist/'))
}

// exports.build = series(
//   series(
//     cleanDistFolder,
//     createDistFolder
//   ),
//   parallel(
//     buildScripts,
//     copyAssets,
//   )
// );

// exports.default = watch(parallel(

// ))


function defaultTask(cb) {
  // place code for your default task here
  cb();
}

exports.build = series(
  series(
    cleanDistFolder,
    createDistFolder
  ),
  parallel(
    buildScripts,
    copyAssets,
  )
);
exports.default = defaultTask
