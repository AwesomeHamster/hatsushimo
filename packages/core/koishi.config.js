const path = require('path')

try {
  require('dotenv').config()
} catch (e) {}

const isDev = process.env.NODE_ENV === 'dev'

const devPlugins = [
  'database-memory',
  'assets-local',
  'console',
  'manager',
  'sandbox',
  'hitokoto',
  'assets-local',
  'ffxiv-eorzea',
  'ffxiv-macrodict',
  'ffxiv-lodestone',
]
const prodPlugins = [
  'adapter-discord',
  'gocqhttp',
  'adapter-onebot',
  'database-mongo',
  'assets-local',
  'admin',
  'sudo',
  'console',
  'auth',
  'status',
  'chat',
  'dataview',
  'bind',
  'echo',
  'recall',
  'feedback',
  'forward',
  'github',
  'repeater',
  'puppeteer',
  'image-search',
  'pics',
  'picsource-lolicon',
  'hitokoto',
  'ffxiv-eorzea',
  'ffxiv-macrodict',
  'ffxiv-lodestone',
]

const plugins = {
  'adapter-discord': {
    selfId: process.env['HATSUSHIMO_DISCORD_SELF_ID'],
    token: process.env['HATSUSHIMO_DISCORD_TOKEN'],
  },

  'gocqhttp': {},

  'adapter-onebot': {
    gocqhttp: true,
    selfId: process.env['HATSUSHIMO_ONEBOT_SELF_ID'],
    password: process.env['HATSUSHIMO_ONEBOT_PASSWORD'],
    protocol: 'ws',
    token: process.env['HATSUSHIMO_ONEBOT_TOKEN'],
    endpoint: 'ws://localhost:6700/',
  },

  'database-memory': {},

  'database-mongo': {
    protocol: 'mongodb+srv',
    host: process.env['HATSUSHIMO_MONGO_HOST'] || 'localhost',
    username: process.env['HATSUSHIMO_MONGO_USERNAME'] || 'root',
    password: process.env['HATSUSHIMO_MONGO_PASSWORD'] || '',
    database: process.env['HATSUSHIMO_MONGO_DATABASE'] || 'koishiv4',
  },

  'assets-local': {
    root: path.resolve(__dirname, 'assets'),
    path: '/static',
    selfUrl: `http://127.0.0.1:${process.env['PORT'] || 8080}`,
    secret: process.env['HATSUSHIMO_ASSETS_SECRET'] || '',
  },

  'admin': {},
  'sudo': {},
  'console': {},
  'manager': {},
  'auth': {},
  'status': {},
  'chat': {},
  'dataview': {},
  'sandbox': {},

  'bind': {
    tokenPrefix: 'hataushimo/',
  },
  'forward': {},
  'echo': {},
  'recall': {},
  'feedback': {
    operators: (process.env['HATSUSHIMO_FEEDBACK_OPERATORS'] || '').split(','),
  },
  'repeater': {
    onRepeat: {
      minTimes: 3,
      probability: 0.75,
    },
  },
  'github': {},

  'puppeteer': {
    browser: { args: ['--no-sandbox'] },
  },

  'image-search': {
    saucenaoApiKey: (process.env['HATSUSHIMO_SAUCENAO_API_KEY'] || '').split(','),
  },
  'ffxiv-eorzea': {},
  'hitokoto': {
    apiUrl: 'https://international.v1.hitokoto.cn',
  },
  'ffxiv-macrodict': {
    aliases: ['?', '宏学词典', 'macro', 'macros', '宏'],
    defaultLanguage: 'chs',
    fetchOnStart: !!isDev,
  },
  'ffxiv-lodestone': {},

  'pics': {
    commandName: 'setu',
  },
  'picsource-lolicon': {
    isDefault: true,
    r18: 0,
  },
}

const getPlugins = (isDev) => {
  if (isDev) {
    return Object.fromEntries(Object.entries(plugins).filter(([name]) => devPlugins.includes(name)))
  } else {
    return Object.fromEntries(Object.entries(plugins).filter(([name]) => prodPlugins.includes(name)))
  }
}

/**
 * @type {import("koishi").App.Config}
 */
module.exports = {
  host: '0.0.0.0',
  port: Number(process.env.PORT) || 8080,
  nickname: ['hamster', '仓鼠'],
  prefix: ['/', '.'],
  delay: {
    character: 5,
    prompt: 60000,
  },
  autoAssign: true,
  autoAuthorize: isDev ? 2 : 1,
  request: {
    proxyAgent: process.env['HTTP_PROXY'] || process.env['HTTPS_PROXY'] || undefined,
  },
  plugins: getPlugins(isDev),
}
