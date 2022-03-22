import { Schema } from 'koishi'

export interface Config {
  aliases?: string[]
  defaultLanguage?: string
  fetchOnStart?: boolean
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Config = Schema.object({
  aliases: Schema.array(Schema.string()),
  defaultLanguage: Schema.union(['en', 'de', 'fr', 'ja', 'ko', 'chs']),
  fetchOnStart: Schema.boolean(),
})
