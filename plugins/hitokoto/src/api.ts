import { Context } from 'koishi'
import { HitokotoOptions } from '.'

export class HitokotoApi {
  private ctx: Context
  private apiUrl: string

  constructor(ctx: Context, option: HitokotoOptions) {
    this.ctx = ctx
    this.apiUrl = option.apiUrl ?? 'https://v1.hitokoto.cn/'
  }

  async getHitokoto(params: Record<string, any> | URLSearchParams): Promise<HitokotoRet> {
    const resp = await this.ctx.http.get<HitokotoRet>(this.apiUrl, {
      params,
    })
    return {
      ...resp,
      // the `from_who` field may be null.
      from_who: resp.from_who ?? '',
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
