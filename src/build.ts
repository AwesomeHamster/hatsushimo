import { readFile } from 'fs-extra'
import { resolve } from 'path'

import type { CAC } from 'cac'
import esbuild, { Plugin } from 'esbuild'
import * as yaml from 'js-yaml'

const yamlPlugin = (options: yaml.LoadOptions = {}): Plugin => ({
  name: 'yaml',
  setup(build) {
    build.onResolve({ filter: /\.ya?ml$/ }, ({ path, resolveDir }) => {
      if (resolveDir === '') return
      return {
        path: resolve(resolveDir, path),
        namespace: 'yaml',
      }
    })

    build.onLoad({ namespace: 'yaml', filter: /.*/ }, async ({ path }) => {
      const source = await readFile(path, 'utf8')
      return {
        loader: 'json',
        contents: JSON.stringify(yaml.load(source, options)),
      }
    })
  },
})

export function apply(cac: CAC): CAC {
  cac
    .command('build [config]')
    .action((config) => {
      let entry = 'src/index.ts'
      let output = 'dist/index.bundle.js'

      if (config) {
        const c = require(config)
        entry = c.entry ?? entry
        output = c.outfile ?? output
      }
      esbuild.build({
        bundle: true,
        format: 'cjs',
        platform: 'node',
        target: 'node12',
        entryPoints: [entry],
        outfile: output,
        external: ['koishi'],
        minify: true,
        sourcemap: true,
        plugins: [yamlPlugin()],
      })
    })

  return cac
}
