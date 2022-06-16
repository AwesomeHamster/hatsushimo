import { Context } from 'koishi'

import * as i18n from './i18n'
import { getNews, NewsCategory, NewsRagion } from './utils'

const categories = [
  'topics',
  'notices',
  'maintenance',
  'updates',
  'status',
  'developers',
]

const ragions = ['jp', 'eu', 'na', 'fr', 'de']

export const name = 'lodestone'

export function apply(ctx: Context, config?: {}): void {
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
    .command('lodestone')
    .alias('ls')
    .option('category', '-c <category:string>')
    .option('ragion', '-r <ragion:string>')
    .before(({ options, session }) => {
      if (!options) return

      const { category, ragion } = options

      if (
        category &&
        !categories.some((cat) => cat === category || cat.startsWith(category))
      ) {
        return session?.text('.invalid_category')
      }
      if (
        ragion &&
        !ragions.some((rag) => rag === ragion || rag.startsWith(ragion))
      ) {
        return session?.text('.invalid_ragion')
      }
    })
    .action(async ({ options, session }) => {
      try {
        const news = (
          await getNews(
            ctx,
            5,
            (options?.category ?? 'topics') as NewsCategory,
            options?.ragion as NewsRagion,
          )
        )
          .map((item) => `${item.title}\n${item.url}`)
          .join('\n\n')
        return news
      } catch (e) {
        console.error(e)
        return session?.text('.service_unavailable')
      }
    })
}
