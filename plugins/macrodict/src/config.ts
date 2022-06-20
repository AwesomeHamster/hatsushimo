import { Schema } from 'koishi'
import { Locale, locales } from './utils'

export interface Config {
  aliases?: string[]
  defaultLanguage?: Locale
  fetchOnStart?: boolean
}

export const Config = Schema.object({
  aliases: Schema.array(Schema.string()),
  defaultLanguage: Schema.union(locales),
  fetchOnStart: Schema.boolean(),
})
