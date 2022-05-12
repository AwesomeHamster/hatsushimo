import { Context } from 'koishi'

import * as time from './commands/time'
import * as i18n from './i18n'

export const name = 'eorzea'

export async function apply(ctx: Context): Promise<void> {
  ctx.i18n.define('de', i18n.de)
  ctx.i18n.define('en', i18n.en)
  ctx.i18n.define('es', i18n.es)
  ctx.i18n.define('fr', i18n.fr)
  ctx.i18n.define('ja', i18n.ja)
  ctx.i18n.define('ko', i18n.ko)
  ctx.i18n.define('ru', i18n.ru)
  ctx.i18n.define('zh', i18n.zh)
  ctx.i18n.define('zh-tw', i18n.zhtw)

  ctx.plugin(time)
}
