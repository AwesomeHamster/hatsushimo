#!/bin/env node
const { exec } = require('./utils')

const REMOTE_MAP = {
  /* eslint-disable @typescript-eslint/naming-convention */
  'packages/constructeur': 'constructeur',
  'plugins/eorzea': 'plugin-eorzea',
  'plugins/hitokoto': 'plugin-hitokoto',
  'plugins/lodestone': 'plugin-lodestone',
  'plugins/macrodict': 'plugin-macrodict',
  /* eslint-enable @typescript-eslint/naming-convention */
}
/**
 * Push subtree to github
 */
async function push(path, name, branch) {
  // setup environment variables in codespaces
  const env = process.env
  if (process.env.GITHUB_TOKEN && process.env.PAT) {
    env.GITHUB_TOKEN = process.env.PAT
  }
  branch ??= 'master'
  console.log(`  ---> Pushing ${path} to ${name}:${branch}`)
  await exec('git', ['subtree', 'push', `--prefix=${path}`, name, branch], {
    env,
  })
}

;(async () => {
  console.log('  ---> Pushing hatsushimo to origin')
  await exec('git', ['push'])

  // push every subtree to github
  for (const [path, name] of Object.entries(REMOTE_MAP)) {
    await push(path, name)
  }
})()
