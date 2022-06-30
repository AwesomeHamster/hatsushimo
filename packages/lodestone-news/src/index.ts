import https from 'https'
import http from 'http'
import { load } from 'cheerio'
import config, { News, Page } from './config'

export const locales = ['na', 'eu', 'fr', 'de', 'jp'] as const
export type Locale = typeof locales[number]

export interface Context {
  locale: Locale
  category: string
  page: number
  referer: string
}

async function getLodestoneNews(
  locale: Locale = 'jp',
  category: string = 'topics',
  page: number = 1,
): Promise<{ news: News[]; page: Page }> {
  if (locales.includes(locale) === false) {
    throw new Error(`Invalid locale: ${locale}`)
  }
  if (Object.prototype.hasOwnProperty.call(config.rules, category) === false) {
    throw new Error(`Invalid category: ${category}`)
  }
  if (page <= 0) {
    throw new Error(`Invalid page: ${page}`)
  }

  const ctx: Context = { locale, category, page, referer: '' }
  const rule = config.rules[category]
  const url = typeof rule.url === 'function' ? rule.url(ctx) : rule.url
  ctx.referer = url

  const resp = await getUrl(url)
  const $ = load(resp)
  const rootNode = rule.rootNode($, ctx)
  const pager = rule.page(rootNode, $, ctx)
  const items = rule.items(rootNode, $, ctx)
  return { news: items, page: pager }
}
export default getLodestoneNews

async function getUrl(url: string) {
  return new Promise<string>((resolve, reject) => {
    ;(url.startsWith('https://') ? https : http).get(url, (res) => {
      let data = ''
      res.setEncoding('utf8')
      res.on('error', reject)
      res.on('data', (chunk) => {
        data += chunk as string
      })
      res.on('end', () => {
        resolve(data)
      })
    })
  })
}
