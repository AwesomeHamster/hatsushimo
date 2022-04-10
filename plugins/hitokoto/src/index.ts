import { Context, Schema } from 'koishi'

import * as i18n from './i18n'
import { HitokotoApi } from './api'
export { HitokotoRet } from './api'

declare module 'koishi' {
  namespace Context {
    interface Services {
      hitokoto: HitokotoApi
    }
  }
}

export interface HitokotoOptions {
  service?: boolean
  /**
   * @default "https://v1.hitokoto.cn"
   */
  apiUrl?: string
  minLength?: number
  maxLength?: number
  /**
   * only reply restricted types of hitokoto sentences
   *
   * Available types can be found on:
   * https://developer.hitokoto.cn/sentence/#%E5%8F%A5%E5%AD%90%E7%B1%BB%E5%9E%8B-%E5%8F%82%E6%95%B0
   */
  defaultTypes?: string[]
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Config = Schema.object({
  apiUrl: Schema.string().description('获取一言的 API 地址').default('https://v1.hitokoto.cn'),
  minLength: Schema.number().description('一言的最小长度'),
  maxLength: Schema.number().description('一言的最大长度'),
  defaultTypes: Schema.array(Schema.string()).description('默认一言类别'),
})

export const name = 'hitokoto'

export async function apply(ctx: Context, _config: HitokotoOptions = {}): Promise<void> {
  const config = {
    apiUrl: 'https://v1.hitokoto.cn/',
    ..._config,
  }

  ctx.i18n.define('en', i18n.en)
  ctx.i18n.define('zh', i18n.zh)

  ctx.plugin(HitokotoApi)

  ctx
    .command('hitokoto')
    .alias('一言')
    .option('type', `-t <type:string>`)
    .option('min-length', `-l <length:int>`)
    .option('max-length', `-L <length:int>`)
    .before(async ({ options, session }) => {
      if (typeof options?.type !== 'undefined') {
        if (!options.type) {
          return session?.text('.invalid_type', [options.type])
        }
        const types = options.type.split(',')
        if (types.length <= 0) {
          return session?.text('.invalid_type', [options.type])
        } else {
          for (const type of types) {
            if (!type) {
              return session?.text('.invalid_type', [options.type])
            }
          }
        }
      }
      if (options?.['min-length'] && options?.['max-length']) {
        if (options['min-length'] > options['max-length']) {
          return session?.text('.min_length_gt_max_length')
        }
      }
    })
    .action(async ({ options, session }) => {
      const params = new URLSearchParams()
      if (options?.type || config.defaultTypes) {
        ;(options?.type?.split(',') || config.defaultTypes || []).forEach((type) => params.append('c', type))
      }
      if (options?.['min-length'] || config.minLength) {
        params.append('min_length', options?.['min-length'] || config.minLength?.toString())
      }
      if (options?.['max-length'] || config.maxLength) {
        params.append('max_length', options?.['max-length'] || config.maxLength?.toString())
      }

      try {
        const resp = await ctx.hitokoto.getHitokoto(params)
        return session?.text('.format', resp)
      } catch (error) {
        const err = error as Error
        if (/ETIMEOUT/.test(err.message)) {
          return session?.text('.timeout')
        }
        return session?.text('.unknown_error', err)
      }
    })

  ctx.command('hitokoto.types').action(async ({ session }) => {
    return session?.text('.list', [
      Object.entries(ctx.hitokoto.types)
        .map(([type, desc]) => `${type} - ${desc}`)
        .join('\n'),
    ])
  })
}
