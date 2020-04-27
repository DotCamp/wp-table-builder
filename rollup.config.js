import replace from '@rollup/plugin-replace';
import alias from '@rollup/plugin-alias';
import resolve from '@rollup/plugin-node-resolve';
import cjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import {terser} from 'rollup-plugin-terser';
import vuePlugin from 'rollup-plugin-vue';
import path from 'path';


const paths = {
    src: path.resolve(__dirname, './inc/admin/js/core/rollup-source'),
    dest: path.resolve(__dirname, './inc/admin/js'),
};

const files = ['WPTB_Admin_Settings', 'WPTB_Import_Menu'];
const isProd = process.env.NODE_ENV === 'production';

const config = files.map(f => ({
    input: path.join(paths.src, `${f}.js`),
    output: {
        file: path.join(paths.dest, `${f}.min.js`),
        format: 'iife',
        sourcemap: !isProd
    },
    plugins: [
        replace({
            'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development')
        }),
        alias({
            entries: [
                {find: 'vue', replacement: 'vue/dist/vue.esm.js'}
            ]
        }),
        resolve({
            browser: true
        }),
        cjs(),
        vuePlugin(),
        babel(),
        terser(),
    ]
}));

export default config;