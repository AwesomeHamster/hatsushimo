#!/bin/env node
const { exec, readConfig } = require('./utils')

/**
 * Push subtree to github
 */
async function push(path, url, branch) {
  // setup environment variables in codespaces
  const env = process.env
  if (process.env.GITHUB_TOKEN && process.env.PAT) {
    env.GITHUB_TOKEN = process.env.PAT
  }
  branch ??= 'master'
  console.log(`  ---> Pushing ${path} to ${url}:${branch}`)
  const code = await exec(
    'git',
    ['subtree', 'push', `--prefix=${path}`, url, branch],
    {
      env,
    },
  )
  if (code !== 0) {
    console.error(`ERROR: Failed to push ${path} to ${url}:${branch}`)
    process.exit(code)
  }
}

;(async () => {
  const config = await readConfig()
  console.log('  ---> Pushing hatsushimo to origin')
  await exec('git', ['push'])

  // push every subtree to github
  for (const { path, url } of Object.values(config.subtree)) {
    await push(path, url)
  }
})()
