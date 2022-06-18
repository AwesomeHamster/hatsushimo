#!/bin/env node
const { exec } = require('./utils')

const REMOTE_MAP = {
  'constructeur': 'https://github.com/AwesomeHamster/constructeur.git',
  'plugin-eorzea':
    'https://github.com/AwesomeHamster/koishi-plugin-ffxiv-eorzea.git',
  'plugin-hitokoto':
    'https://github.com/AwesomeHamster/koishi-plugin-hitokoto.git',
  'plugin-lodestone':
    'https://github.com/AwesomeHamster/koishi-plugin-ffxiv-lodestone.git',
  'plugin-macrodict':
    'https://github.com/AwesomeHamster/koishi-plugin-ffxiv-macrodict.git',
}

/** Register remote url */
async function register(name, url) {
  return await exec('git', ['remote', 'add', name, url])
}

;(async () => {
  for (const [name, url] of Object.entries(REMOTE_MAP)) {
    await register(name, url)
  }
})()
