const path = require('path')

try {
  require('dotenv').config()
} catch (e) {}

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
  selfUrl: process.env['HATSUSHIMO_SELF_URL'],
  autoAssign: true,
  autoAuthorize: 1,
  plugins: {
    'adapter-discord': {
      bots: [
        {
          selfId: process.env['HATSUSHIMO_DISCORD_SELF_ID'],
          token: process.env['HATSUSHIMO_DISCORD_TOKEN'],
        },
      ],
    },

    'gocqhttp': {},

    'adapter-onebot': {
      bots: [
        {
          gocqhttp: true,
          selfId: process.env['HATSUSHIMO_ONEBOT_SELF_ID'],
          password: process.env['HATSUSHIMO_ONEBOT_PASSWORD'],
          protocol: 'ws',
          token: process.env['HATSUSHIMO_ONEBOT_TOKEN'],
          endpoint: 'ws://localhost:6700/',
        },
      ],
    },

    'database-mongo': {
      protocol: 'mongodb+srv',
      port: 0,
      host: process.env['HATSUSHIMO_MONGO_HOST'],
      username: process.env['HATSUSHIMO_MONGO_USERNAME'],
      password: process.env['HATSUSHIMO_MONGO_PASSWORD'],
      database: process.env['HATSUSHIMO_MONGO_DATABASE'],
    },

    'assets-local': {
      root: path.resolve(__dirname, 'assets'),
      path: '/static',
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

    'bind': {
      tokenPrefix: 'hataushimo/',
    },
    'forward': {},
    'echo': {},
    'recall': {},
    'feedback': {
      operators: (process.env['HATSUSHIMO_FEEDBACK_OPERATORS'] || '').split(
        ',',
      ),
    },
    'repeater': {
      onRepeat: {
        minTimes: 3,
        probability: 0.75,
      },
    },
    'github': {
      appId: process.env['HATSUSHIMO_GITHUB_APP_ID'],
      appSecret: process.env['HATSUSHIMO_GITHUB_APP_SECRET'],
    },

    'puppeteer': {
      browser: { args: ['--no-sandbox'] },
    },
    'teach': {},

    '~image-search': {
      saucenaoApiKey: (process.env['HATSUSHIMO_SAUCENAO_API_KEY'] || '').split(
        ',',
      ),
    },
    'ffxiv-eorzea': {},
    'hitokoto': {
      apiUrl: 'https://international.v1.hitokoto.cn',
    },
    'ffxiv-macrodict': {
      aliases: ['?', '宏学词典', 'macro', 'macros', '宏'],
      defaultLanguage: 'chs',
    },
    'ffxiv-lodestone': {},

    'pics': {
      commandName: 'setu',
    },
    'picsource-lolicon': {
      isDefault: true,
      r18: 0,
      extraConfig: {
        size: 'regular',
      },
    },
  },
}
