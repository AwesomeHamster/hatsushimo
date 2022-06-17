import { Context } from 'koishi'

import * as time from './commands/time'
import i18n from './i18n'

export const name = 'eorzea'

export async function apply(ctx: Context): Promise<void> {
  Object.entries(i18n).forEach(([key, value]) => ctx.i18n.define(key, value))

  ctx.plugin(time)
}
