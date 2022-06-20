import { Search } from './search'

export type MacroDictDatabase = Record<
  LocalizedKeys<CommandPrefix | 'Description'>,
  string
> & {
  id: number
  lastUpdated: number
}

declare module 'koishi' {
  interface Tables {
    macrodict: MacroDictDatabase
  }

  namespace Context {
    interface Services {
      macrodict: Search
    }
  }

  interface Events {
    /* eslint-disable @typescript-eslint/naming-convention */
    'macrodict/update': () => void
    /* eslint-enable @typescript-eslint/naming-convention */
  }
}

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

export const commandPrefixKeys = commandPrefix
  .map((loc) => localizeKeys(loc, ['chs', 'de', 'en', 'fr', 'ja', 'ko']))
  .flat()
