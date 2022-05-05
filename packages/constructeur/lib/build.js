const { readFile } = require('fs-extra')
const { resolve } = require('path')

const esbuild = require('esbuild')
const yaml = require('js-yaml')

/**
 * @param {yaml.LoadOptions} options
 * @returns {import('esbuild').Plugin}
 */
const yamlPlugin = (options = {}) => ({
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

/** @typedef {import('cac').CAC} CAC */
/**
 * @param {CAC} cac
 * @returns {CAC}
 */
function apply(cac) {
  cac
    .command('build [config]')
    .option('minify', 'minify the bundle', { default: true })
    .action((config, options) => {
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
        minify: options.minify,
        sourcemap: true,
        plugins: [yamlPlugin()],
      })
    })

  return cac
}

module.exports.apply = apply
