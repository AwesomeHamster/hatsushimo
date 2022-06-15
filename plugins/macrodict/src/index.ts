import { Context } from 'koishi'

import { Config } from './config'
import { Updater } from './update'
import * as i18n from './i18n'
import { Search } from './search'

declare module 'koishi' {
  interface Tables {
    macrodict: MacroDictDatabase
  }

  namespace Context {
    interface Services {
      macrodict: Search
    }
  }
}

export { Config }

export const locales = ['en', 'de', 'fr', 'ja', 'ko', 'chs'] as const
export type Locale = typeof locales[number]
export type LocalizedKeys<T extends string> = `${T}_${Locale}`

export type MacroDictDatabase = Record<
  LocalizedKeys<
    'Command' | 'Alias' | 'ShortCommand' | 'ShortAlias' | 'Description'
  >,
  string
> & {
  id: number
  lastUpdated: number
}

export const name = 'macrodict'

// only allow when database available
export const using = ['database'] as const

export async function apply(ctx: Context, _config: Config): Promise<void> {
  // set database
  ctx.model.extend(
    'macrodict',
    {
      id: 'unsigned',
      lastUpdated: 'integer',
      ...['Command', 'ShortCommand', 'Alias', 'ShortAlias', 'Description']
        .map((key) => localizedKeys(key, 'string'))
        .flat(),
    },
    {
      primary: 'id',
    },
  )

  const config = {
    aliases: [],
    defaultLanguage: 'en',
    ..._config,
  }

  ctx.i18n.define('de', i18n.de)
  ctx.i18n.define('en', i18n.en)
  ctx.i18n.define('es', i18n.es)
  ctx.i18n.define('fr', i18n.fr)
  ctx.i18n.define('ja', i18n.ja)
  ctx.i18n.define('ko', i18n.ko)
  ctx.i18n.define('ru', i18n.ru)
  ctx.i18n.define('zh', i18n.zh)
  ctx.i18n.define('zh-tw', i18n.zhtw)

  ctx.plugin(Search)

  ctx
    .command('macrodict <macro>')
    .alias(...config.aliases)
    .option('lang', '-l <language:string>')
    .action(async ({ session, options }, macro) => {
      let lang = (options?.lang as Locale) ?? config.defaultLanguage
      if (!lang || !locales.includes(lang)) {
        session?.sendQueued(
          session.text('.wrong_language', [lang, config.defaultLanguage]),
        )
        lang = config.defaultLanguage as Locale
      }
      macro = macro.startsWith('/') ? macro : '/' + macro
      const db = await ctx.macrodict.search(macro, lang)

      if (session) {
        return await ctx.macrodict.render(db)
      }
    })

  ctx.plugin(Updater)
}

export function localizedKeys<T extends string, V>(
  key: T,
  value: V,
): Record<LocalizedKeys<T>, V> {
  return Object.fromEntries(
    locales.map((loc) => [`${key}_${loc}`, value]),
  ) as Record<LocalizedKeys<T>, V>
}
