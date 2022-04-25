import { Context, Service } from 'koishi'
import { Config } from '.'

declare module 'koishi' {
  namespace Context {
    interface Services {
      hitokoto: HitokotoApi
    }
  }
}

export interface HitokotoParams {
  c?: string[]
  min_length?: number
  max_length?: number
}

export class HitokotoApi extends Service {
  private _apiUrl: string

  constructor(ctx: Context, option: Config) {
    super(ctx, 'hitokoto', true)
    this._apiUrl = option.apiUrl ?? 'https://v1.hitokoto.cn/'
  }

  async getHitokoto(params: HitokotoParams): Promise<HitokotoRet> {
    const resp = await this.ctx.http.get<HitokotoRet>(this._apiUrl, {
      params: this.buildSearchParams(params),
    })
    return {
      ...resp,
      // the `from_who` field may be null.
      from_who: resp.from_who ?? '',
    }
  }

  buildSearchParams(params: HitokotoParams): URLSearchParams {
    const searchParams = new URLSearchParams()
    if (params.c) {
      params.c.forEach((type) => searchParams.append('c', type))
    }
    if (params.min_length) {
      searchParams.append('min_length', params.min_length.toString())
    }
    if (params.max_length) {
      searchParams.append('max_length', params.max_length.toString())
    }
    return searchParams
  }

  get types() {
    return {
      a: '动画',
      b: '漫画',
      c: '游戏',
      d: '文学',
      e: '原创',
      f: '来自网络',
      g: '其他',
      h: '影视',
      i: '诗词',
      j: '网易云',
      k: '哲学',
      l: '抖机灵',
    }
  }
}

export interface HitokotoRet {
  id: number
  hitokoto: string
  type: string
  from: string
  from_who: string | null
  creator: string
  creator_uid: number
  reviewer: number
  uuid: string
  commit_from: string
  created_at: string
  length: number
}
