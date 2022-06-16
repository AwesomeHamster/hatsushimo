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

export function localizedKeys<T extends string, V>(
  key: T,
  value: V,
): Record<LocalizedKeys<T>, V> {
  return Object.fromEntries(
    locales.map((loc) => [`${key}_${loc}`, value]),
  ) as Record<LocalizedKeys<T>, V>
}
