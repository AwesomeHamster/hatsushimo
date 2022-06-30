#!/bin/env node
const { exec } = require('./utils')

;(async () => {
  // setup environment variables in codespaces
  const env = process.env
  if (process.env.GITHUB_TOKEN && process.env.PAT) {
    env.GITHUB_TOKEN = process.env.PAT
  }
  // push every subtree to github
  const code = await exec('git', ['submodule', 'foreach', 'git push'], {
    env,
  })
  if (code !== 0) {
    process.exit(code)
  }
})()
