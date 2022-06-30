const { spawn } = require('child_process')

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
}
