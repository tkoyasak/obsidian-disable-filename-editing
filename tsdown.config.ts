import { defineConfig } from 'tsdown'
import { builtinModules } from 'node:module'

export default defineConfig({
  entry: ['./src/main.ts'],
  format: 'cjs',
  target: 'node20.18',
  minify: true,
  external: [
    '@codemirror/autocomplete',
    '@codemirror/collab',
    '@codemirror/commands',
    '@codemirror/language',
    '@codemirror/lint',
    '@codemirror/search',
    '@codemirror/state',
    '@codemirror/view',
    '@lezer/common',
    '@lezer/highlight',
    '@lezer/lr',
    'electron',
    'obsidian',
    ...builtinModules,
  ],
})
