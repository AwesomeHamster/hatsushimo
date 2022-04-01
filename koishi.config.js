// eslint-disable-next-line @typescript-eslint/naming-convention
const { Random } = require('koishi')

try {
  require('dotenv').config()
} catch (e) {}

const isDev = process.env.NODE_ENV === 'dev'

const devPlugins = [
  'database-memory',
  'console',
  'manager',
  'sandbox',
  './plugins/eorzea',
  './plugins/hitokoto',
  './plugins/macrodict',
  './plugins/lodestone',
  'pics',
  'picsource-lolicon',
]
const prodPlugins = [
  'adapter-discord',
  'gocqhttp',
  'adapter-onebot',
  'database-mongo',
  'admin',
  'sudo',
  'console',
  'auth',
  'status',
  'chat',
  'dataview',
  'bind',
  'callme',
  'echo',
  'recall',
  'feedback',
  'schedule',
  'repeater',
  'puppeteer',
  'image-search',
  'pics',
  'picsource-lolicon',
  './plugins/eorzea',
  './plugins/hitokoto',
  './plugins/macrodict',
  './plugins/lodestone',
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
    generateToken: () => 'hataushimo/' + Random.id(6, 10),
  },
  'callme': {},
  'echo': {},
  'recall': {},
  'feedback': {
    operators: (process.env['HATSUSHIMO_FEEDBACK_OPERATORS'] || '').split(','),
  },
  'schedule': {},
  'repeater': {
    onRepeat: {
      minTimes: 3,
      probability: 0.75,
    },
  },

  'puppeteer': {
    browser: { args: ['--no-sandbox'] },
  },

  'image-search': {
    saucenaoApiKey: (process.env['HATSUSHIMO_SAUCENAO_API_KEY'] || '').split(','),
  },
  './plugins/eorzea': {
    template: {
      format: '现在艾欧泽亚时间是 {{eorzeaTime}}',
    },
  },
  './plugins/hitokoto': {
    apiUrl: 'https://international.v1.hitokoto.cn',
  },
  './plugins/macrodict': {
    aliases: ['?', '宏学词典', 'macro', 'macros', '宏'],
    defaultLanguage: 'chs',
    fetchOnStart: !!isDev,
  },
  './plugins/lodestone': {},

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
