const { spawn } = require('child_process')
const { promises: fsp } = require('fs')
const path = require('path')

const yaml = require('js-yaml')

async function readConfig() {
  return yaml.load(await fsp.readFile(path.resolve(__dirname, 'config.yaml')))
}

async function exec(command, args, options = {}) {
  return await new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: process.cwd(),
      stdio: 'inherit',
      ...options,
    })
    child.on('exit', (code) => resolve(code))
    child.on('error', () => resolve(-1))
  })
}

module.exports = {
  exec,
  readConfig,
}
