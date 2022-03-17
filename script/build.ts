import { readFile } from "fs-extra";
import { resolve } from "path";

import esbuild, { Plugin } from "esbuild";
import * as yaml from "js-yaml";

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

esbuild.build({
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "node12",
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.bundle.js",
  external: ["koishi"],
  minify: true,
  plugins: [yamlPlugin()],
});
