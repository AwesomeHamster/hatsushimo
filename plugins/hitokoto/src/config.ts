import { Schema } from 'koishi'

export interface Config {
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
  apiUrl: Schema.string()
    .description('获取一言的 API 地址')
    .default('https://v1.hitokoto.cn'),
  minLength: Schema.number().description('一言的最小长度'),
  maxLength: Schema.number().description('一言的最大长度'),
  defaultTypes: Schema.array(Schema.string()).description('默认一言类别'),
})
