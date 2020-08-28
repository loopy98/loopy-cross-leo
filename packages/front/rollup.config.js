// Reference: https://codechips.me/how-to-use-typescript-with-svelte/

import svelte from 'rollup-plugin-svelte'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import html from 'rollup-plugin-html2'
import serve from 'rollup-plugin-serve'
import typescript from '@rollup/plugin-typescript'
import { transformSync } from '@swc/core'
import preprocess from 'svelte-preprocess'

const isDev = process.env.NODE_ENV === 'development'
const buildDir = 'dist'
const port = 3000

const plugins = [
  svelte({
    dev: isDev,
    extensions: ['.svelte'],
    preprocess: preprocess({
      typescript({ content }) {
        // use SWC to transpile TS scripts in Svelte files
        const { code } = transformSync(content, {
          jsc: {
            parser: { syntax: 'typescript' }
          }
        });
        return { code };
      }
    }),
  }),
  typescript({ sourceMap: isDev }),
  resolve({
    browser: true,
    dedupe: ['svelte'],
  }),
  commonjs(),
  html({
    template: 'src/index.html',
    fileName: 'index.html',
  }),
]

if (isDev) {
  // Development config
  plugins.push(
    serve({
      contentBase: buildDir,
      historyApiFallback: true,
      port,
    }),
    livereload({ watch: buildDir }),
  )
} else {
  // Production config
  plugins.push(terser({ sourcemap: isDev }));
}

module.exports = {
  input: 'src/main.ts',
  output: {
    name: 'bundle',
    file: `${buildDir}/bundle.js`,
    sourcemap: isDev,
    format: 'iife',
  },
  plugins,
}
