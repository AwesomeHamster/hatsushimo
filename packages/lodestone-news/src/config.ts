import { Cheerio, CheerioAPI, Element } from 'cheerio'
import { Context } from '.'
import { fixUrl } from './utils'

const locales = {
  pager: {
    na: /Page (?<current>\d+) of (?<total>\d+)/,
    eu: /Page (?<current>\d+) of (?<total>\d+)/,
    fr: /Page (?<current>\d+) \/ (?<total>\d+)/,
    de: /Seite (?<current>\d+) \(von (?<total>\d+)\)/,
    jp: /(?<current>\d+)ページ \/ (?<total>\d+)ページ/,
  },
}

const baseRule: Pick<Rule, 'rootNode' | 'page' | 'items'> = {
  rootNode: ($) =>
    $('#news')
      .children('div.ldst__bg')
      .children('div.ldst__contents')
      .children('div.ldst__main')
      .children('div.news__content'),
  page(el, $, context) {
    const pager = el
      .find('ul.btn__pager > li.btn__pager__current')
      .first()
      .text()
    const m = locales.pager[context.locale].exec(pager)
    return {
      current: parseInt(m?.[1] ?? '0', 10),
      total: parseInt(m?.[2] ?? '0', 10),
    }
  },
  items(el, $, context) {
    // There might be a "Special Notice" section, but we don't need it.
    // So we have to find the news item without the "parts__space--add" class.
    const items = el.find('ul:not(.parts__space--add) > li.news__list')
    return items
      .map((i, el) => {
        const $a = $(el).find('a')

        const title = $a.find('p.news__list--title').text()
        const url = $a.attr('href')!

        const $timeScript = $a.find('time.news__list--time > script').text()
        const time = $timeScript.match(/ldst_strftime\((\d+), 'YMD'\);/)?.[1]!
        const epoch = parseInt(time, 10)
        return {
          title,
          epoch,
          date: new Date(epoch * 1000),
          url: fixUrl(url, context.referer),
        }
      })
      .toArray()
  },
}

const config: Config = {
  rules: {
    topics: {
      ...baseRule,
      url: ({ locale, page }) =>
        `https://${locale}.finalfantasyxiv.com/lodestone/topics/?page=${page}`,
      items(el, $, context) {
        const items = el.find('li.news__list--topics')
        return items
          .map((i, el) => {
            const $header = $(el).find('header.news__list--header')
            const $title = $($header).find('p.news__list--title > a')

            const title = $title.text()
            const url = $title.attr('href')!

            const $timeScript = $($header)
              .find('time.news__list--time > script')
              .text()
            const time = $timeScript.match(
              /ldst_strftime\((\d+), 'YMD'\);/,
            )?.[1]!
            const epoch = parseInt(time, 10)

            return {
              title,
              epoch,
              date: new Date(epoch * 1000),
              url: fixUrl(url, context.referer),
            }
          })
          .toArray()
      },
    },
    notices: {
      ...baseRule,
      url: ({ locale, page }) =>
        `https://${locale}.finalfantasyxiv.com/lodestone/news/category/1?page=${page}`,
    },
    maintenance: {
      ...baseRule,
      url: ({ locale, page }) =>
        `https://${locale}.finalfantasyxiv.com/lodestone/news/category/2?page=${page}`,
    },
    updates: {
      ...baseRule,
      url: ({ locale, page }) =>
        `https://${locale}.finalfantasyxiv.com/lodestone/news/category/3?page=${page}`,
    },
    status: {
      ...baseRule,
      url: ({ locale, page }) =>
        `https://${locale}.finalfantasyxiv.com/lodestone/news/category/4?page=${page}`,
    },
  },
}

export default config

export interface Config {
  rules: Record<string, Rule>
}

export interface Rule {
  url: string | ((context: Context) => string)
  page: (el: Cheerio<Element>, $: CheerioAPI, ctx: Context) => Page
  rootNode: ($: CheerioAPI, ctx: Context) => Cheerio<Element>
  items: (l: Cheerio<Element>, $: CheerioAPI, ctx: Context) => News[]
}

export interface News {
  title: string
  epoch: number
  date: Date
  url: string
}

export interface Page {
  current: number
  total: number
}
