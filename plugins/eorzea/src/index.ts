import { Context } from 'koishi'

import * as time from './commands/time'
import * as i18n from './i18n'

export const name = 'eorzea'

export async function apply(ctx: Context): Promise<void> {
  ctx.i18n.define('zh', i18n.zh)
  ctx.plugin(time)
}
