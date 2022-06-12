import { closest } from 'fastest-levenshtein'
import { Context } from 'koishi'

import { Config } from './config'
import { renderMacroView } from './render'
import { Updater } from './update'
import * as i18n from './i18n'

declare module 'koishi' {
  interface Tables {
    macrodict: MacroDictDatabase
  }
}

export { Config }

export const locales = ['en', 'de', 'fr', 'ja', 'ko', 'chs'] as const
export type Locale = typeof locales[number]
export const commandPrefix = [
  'Command',
  'Alias',
  'ShortCommand',
  'ShortAlias',
] as const
export type CommandPrefix = typeof commandPrefix[number]
export type LocalizedKeys<T extends string> = `${T}_${Locale}`

export function localizeKeys<T extends string>(
  key: T,
  loc?: Locale[],
): LocalizedKeys<T>[] {
  loc ??= locales as unknown as Locale[]
  return loc.map((locale) => `${key}_${locale}`) as LocalizedKeys<T>[]
}

export function localizeCommandPrefix(lang: Locale) {
  const langKeys: Locale[] = lang === 'en' ? ['en'] : ['en', lang]
  return commandPrefix.map((prefix) => localizeKeys(prefix, langKeys)).flat()
}

export type MacroDictDatabase = Record<
  LocalizedKeys<CommandPrefix | 'Description'>,
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
      ...[...commandPrefix, 'Description']
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
      const all = await ctx.database.get('macrodict', {}, [
        'id',
        ...localizeCommandPrefix(lang),
      ])
      const predict = closest(
        macro,
        all
          .map((row) => localizeCommandPrefix(lang).map((key) => row[key]))
          .flat(2),
      )
      const found = all.find((row) =>
        localizeCommandPrefix(lang)
          .map((key) => row[key])
          .includes(predict),
      )
      if (!found) {
        return session?.text('.not_found', [macro])
      }
      const db = await ctx.database.get(
        'macrodict',
        { id: { $eq: found.id } },
        [`Command_${lang}`, `Description_${lang}`],
      )

      const puppeteer = ctx.puppeteer

      if (!puppeteer) {
        return session?.text('.not_found_puppeteer')
      }

      if (!db || !db[0]) {
        return session?.text('.not_found_macro', [macro])
      }

      if (session) {
        return renderMacroView(session, puppeteer, {
          name: db[0][`Command_${lang}`],
          description: db[0][`Description_${lang}`],
        })
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
