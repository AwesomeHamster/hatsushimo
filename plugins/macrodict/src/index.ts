import { Context } from 'koishi'

import { Config } from './config'
import { renderMacroView } from './render'
import { updateMacros } from './update'
import * as i18n from './i18n'

declare module 'koishi' {
  interface Tables {
    macrodict: MacroDictDatabase
  }
}

export { Config }

const locales = ['en', 'de', 'fr', 'ja', 'ko', 'chs'] as const

export type LocalizedKeys<T extends string> = `${T}_${typeof locales[number]}`

export type MacroDictDatabase = Record<
  LocalizedKeys<'Command' | 'Alias' | 'ShortCommand' | 'ShortAlias' | 'Description'>,
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
      ...localizedKeys('Command', 'string'),
      ...localizedKeys('ShortCommand', 'string'),
      ...localizedKeys('Alias', 'string'),
      ...localizedKeys('ShortAlias', 'string'),
      ...localizedKeys('Description', 'string'),
    },
    {
      primary: 'id',
    },
  )

  const config = {
    aliases: [],
    axiosConfig: {},
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
  ctx.i18n.define('zht', i18n.zhtw)

  ctx
    .command('macrodict <macro>')
    .alias(...config.aliases)
    .option('lang', '-l <language:string>')
    .action(async ({ session, options }, macro) => {
      let lang = (options?.lang as typeof locales[number]) ?? config.defaultLanguage
      if (!lang || !locales.includes(lang)) {
        session?.sendQueued(session.text('.wrong_language', [locales.join(', '), config.defaultLanguage]))
        lang = config.defaultLanguage as typeof locales[number]
      }
      macro = macro.startsWith('/') ? macro : '/' + macro
      const db = await ctx.database.get(
        'macrodict',
        {
          $or: [
            { [`Command_${lang}`]: { $eq: macro } },
            { [`ShortCommand_${lang}`]: { $eq: macro } },
            { [`Alias_${lang}`]: { $eq: macro } },
            { [`ShortAlias_${lang}`]: { $eq: macro } },
            /* eslint-disable @typescript-eslint/naming-convention */
            { Command_en: { $eq: macro } },
            { ShortCommand_en: { $eq: macro } },
            { Alias_en: { $eq: macro } },
            { ShortAlias_en: { $eq: macro } },
            /* eslint-enable @typescript-eslint/naming-convention */
          ],
        },
        [`Command_${lang}`, `Description_${lang}`, 'id'],
      )

      const puppeteer = ctx.puppeteer

      if (!puppeteer) {
        return session?.text('.not_found_puppeteer')
      }

      if (!db || !db[0]) {
        return session?.text('.not_found_macro', [macro])
      }

      return renderMacroView(puppeteer, {
        name: db[0][`Command_${lang}`],
        description: db[0][`Description_${lang}`],
      })
    })

  if (config.fetchOnStart) {
    // update macro database when bot connected successfully.
    ctx.on('ready', () => updateMacros(ctx))
  }

  ctx.command('macrodict.update').action(({ session }) => {
    session?.sendQueued(session.text('.start_updating_macros'))
    updateMacros(ctx)
  })
}

export function localizedKeys<T extends string, V>(key: T, value: V): Record<LocalizedKeys<T>, V> {
  return Object.fromEntries(locales.map((loc) => [`${key}_${loc}`, value])) as Record<LocalizedKeys<T>, V>
}
