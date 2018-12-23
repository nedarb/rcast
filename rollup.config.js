/* eslint-env node */

'use strict';

const path = require('path');
const lwc = require('@lwc/rollup-plugin');
const copy = require('rollup-plugin-copy');
const replace = require('rollup-plugin-replace');
const filesize = require('rollup-plugin-filesize');
const { terser } = require('rollup-plugin-terser');

const SRC_DIR = path.resolve(__dirname, './src/client');
const DIST_DIR = path.resolve(__dirname, './dist');

const __ENV__ = process.env.NODE_ENV || 'development';
const __PROD__ = __ENV__ === 'production';

module.exports = {
    input: path.resolve(SRC_DIR, 'index.js'),

    output: {
        file: path.resolve(DIST_DIR, 'public/index.js'),
        format: 'es',
        sourcemap: true,
    },

    plugins: [
        lwc({
            rootDir: path.resolve(SRC_DIR, 'modules'),
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify(__ENV__),
        }),
        copy({
            [path.resolve(SRC_DIR, 'index.html')]: path.resolve(
                DIST_DIR,
                'index.html',
            ),
            [path.resolve(SRC_DIR, 'public/')]: path.resolve(
                DIST_DIR,
                'public/',
            ),
        }),
        __PROD__ && terser(),
        filesize(),
    ].filter(Boolean),
};
