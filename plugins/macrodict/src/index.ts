import { closest } from 'fastest-levenshtein'
import { Context } from 'koishi'

import { Config } from './config'
import { Updater } from './update'
import i18n from './i18n'
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

  // register i18n resources
  Object.entries(i18n).forEach(([key, value]) => ctx.i18n.define(key, value))

  ctx.plugin(Search)
  ctx.plugin(Updater)

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

      return await ctx.macrodict.render(db)
    })
}

export function localizedKeys<T extends string, V>(
  key: T,
  value: V,
): Record<LocalizedKeys<T>, V> {
  return Object.fromEntries(
    locales.map((loc) => [`${key}_${loc}`, value]),
  ) as Record<LocalizedKeys<T>, V>
}
