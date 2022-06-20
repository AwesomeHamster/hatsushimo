import { Context } from 'koishi'

import { Config } from './config'
import i18n from './i18n'
import { Search } from './search'
import { Updater } from './update'
import { commandPrefix, Locale, locales, localizeKeys } from './utils'

export { Config }

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
      ...Object.fromEntries(
        ['Description']
          .concat(commandPrefix)
          .map((key) => localizeKeys(key, [...locales]))
          .flat()
          .map((value) => [value, 'string']),
      ),
    },
    {
      primary: 'id',
    },
  )

  const config: Required<Config> = {
    aliases: [],
    defaultLanguage: 'en',
    fetchOnStart: false,
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
      const db = await ctx.macrodict.search(macro, lang)

      if (!db) {
        return session?.text('.not_found_macro')
      }

      if (db.exactly) {
        session?.text('.hint', [db.name])
      }
      return await ctx.macrodict.render(db)
    })
}
