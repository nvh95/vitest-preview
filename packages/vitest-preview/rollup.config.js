import { builtinModules } from 'module';
import { defineConfig } from 'rollup';
import esbuild from 'rollup-plugin-esbuild';
import commonjs from '@rollup/plugin-commonjs';
import dts from 'rollup-plugin-dts';
import nodeResolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';

import pkg from './package.json' assert { type: 'json' };

const entries = ['src/index.ts'];
const cliEntries = ['src/node/previewServer.ts'];
const dtsEntries = ['src/index.ts'];

const external = [
  ...builtinModules,
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.devDependencies),
  // TODO: Do we need any peer deps here?
  // ...Object.keys(pkg.peerDependencies),
];

const plugins = [
  nodeResolve({
    preferBuiltins: true,
  }),
  json(),
  commonjs(),
  esbuild({
    target: 'node14',
  }),
];

export default ({ watch }) =>
  defineConfig([
    {
      input: entries,
      output: {
        dir: 'dist',
        format: 'esm',
      },
      external,
      plugins: [...plugins],
    },
    {
      input: cliEntries,
      output: {
        dir: 'dist',
        format: 'esm',
        banner: '#!/usr/bin/env node',
        entryFileNames: '[name].mjs',
      },
      external,
      plugins: [...plugins],
    },
    {
      input: dtsEntries,
      output: {
        dir: 'dist',
        entryFileNames: (chunk) => `${chunk.name.replace('src/', '')}.d.ts`,
        format: 'esm',
      },
      external,
      plugins: [dts({ respectExternal: true })],
    },
  ]);
