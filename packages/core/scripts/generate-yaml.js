const path = require('path')
const { outputFile } = require('fs-extra')
const yaml = require('js-yaml')

function jsToYaml(obj, filename) {
  const content = yaml.dump(obj, { indent: 2 })
  outputFile(filename, content)
}

console.log(' ---> generating YAML files')
jsToYaml(
  require(path.resolve(__dirname, '..', 'koishi.config.js')),
  path.resolve(__dirname, '..', 'koishi.yaml'),
)
