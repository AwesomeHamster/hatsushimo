import { Context } from 'koishi'

export type NewsCategory =
  | 'topics'
  | 'notices'
  | 'maintenance'
  | 'updates'
  | 'status'
  | 'developers'
export type NewsRagion = 'na' | 'jp' | 'eu' | 'fr' | 'de'

export interface News {
  id: string
  title: string
  url: string
  time: string
  image: string
  description: string
}

export const getNews = async (
  ctx: Context,
  count: number,
  category: NewsCategory = 'topics',
  ragion: NewsRagion = 'jp',
): Promise<News[]> => {
  const url = `http://${ragion}.lodestonenews.com/news/${category}`
  const json = (await ctx.http.get(url)) as News[]
  if (json.length > count) return json.slice(0, count)
  return json
}

export const getWebpage = async (
  ctx: Context,
  url: string,
): Promise<string> => {
  return (await ctx.http.get(url)).data as string
}
