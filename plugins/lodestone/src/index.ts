import { Context } from 'koishi'

import * as i18n from './i18n'
import { getNews, NewsCategory, NewsRagion } from './utils'

const categories = ['topics', 'notices', 'maintenance', 'updates', 'status', 'developers']

const ragions = ['jp', 'eu', 'na', 'fr', 'de']

export const name = 'lodestone'

export function apply(ctx: Context, config?: {}): void {
  ctx.i18n.define('zh', i18n.zh)

  ctx
    .command('lodestone')
    .alias('ls')
    .option('category', '-c <category:string>')
    .option('ragion', '-r <ragion:string>')
    .before(({ options, session }) => {
      if (!options) return

      const { category, ragion } = options

      if (category && !categories.includes(category)) {
        return session?.text('.invalid_category', [categories.join(', ')])
      }
      if (ragion && !ragions.includes(ragion)) {
        return session?.text('.invalid_ragion', [ragions.join(', ')])
      }
    })
    .action(async ({ options, session }, category) => {
      try {
        const news = (await getNews(ctx, 5, (category ?? 'topics') as NewsCategory, options?.ragion as NewsRagion))
          .map((item) => `${item.title}\n${item.url}`)
          .join('\n\n')
        return news
      } catch (e) {
        console.error(e)
        return session?.text('.service_unavailable')
      }
    })
}
