import { Context, segment, Service } from 'koishi'
import type {} from '@koishijs/plugin-puppeteer'
import path from 'path'

import { commandPrefixKeys, Locale } from './utils'
import { parseMacroDescriptionForHtml } from './parser'
import { closest } from 'fastest-levenshtein'

interface Macro {
  id: number
  name: string
  description: string
}

export class Search extends Service {
  names?: Record<Locale, Record<number, string[]>>

  constructor(ctx: Context) {
    super(ctx, 'macrodict', true)

    this.ctx.on(
      'macrodict/update',
      async () => (this.names = await this.getNames()),
    )
  }

  async getNames(): Promise<Record<Locale, Record<number, string[]>>> {
    const db = await this.ctx.database.get('macrodict', {}, [
      'id',
      ...commandPrefixKeys,
    ])

    const ret: Record<Locale, Record<number, string[]>> = {
      en: {},
      de: {},
      fr: {},
      ja: {},
      chs: {},
      ko: {},
    }

    for (const row of db) {
      const { id } = row
      for (const key of commandPrefixKeys) {
        const loc = key.substring(key.lastIndexOf('_') + 1) as Locale
        if (typeof ret[loc][id] === 'undefined') {
          ret[loc][id] = []
        }
        ret[loc][id].push(row[key])
      }
    }

    return ret
  }

  async get(id: number, lang: Locale): Promise<Macro> {
    const db = await this.ctx.database.get(
      'macrodict',
      {
        id: { $eq: id },
      },
      ['id', `Command_${lang}`, `Description_${lang}`],
    )
    return {
      id: db[0].id,
      name: db[0][`Command_${lang}`],
      description: db[0][`Description_${lang}`],
    }
  }

  async search(
    name: string,
    lang: Locale,
  ): Promise<{ name: string; description: string; id: number } | undefined> {
    if (!this.names) {
      this.names = await this.getNames()
    }

    const predict = closest(
      name,
      ([] as string[][]).concat(Object.values(this.names[lang])).flat(),
    )

    if (!predict) {
      return
    }

    const id = Object.entries(this.names[lang]).find(([_, value]) => value.includes(predict))?.[0]

    if (!id) {
      return
    }

    const db = await this.ctx.database.get('macrodict', id, [
      `Command_${lang}`,
      `Description_${lang}`,
      'id',
    ])

    if (!db || !db[0]) {
      return
    }

    const macro = db[0]

    return {
      id: macro.id,
      name: macro[`Command_${lang}`],
      description: macro[`Description_${lang}`],
    }
  }

  async render(macro: { name: string; description: string }): Promise<string> {
    const { puppeteer } = this.ctx

    if (!puppeteer) {
      throw new Error('Not found puppeteer.')
    }

    const { name, description } = macro
    const descriptionHtml = parseMacroDescriptionForHtml(description)

    const page = await puppeteer.page()

    await page.goto(`file:///${path.resolve(__dirname, '../view/macro.html')}`)

    const result = await page.evaluate(
      (name, description) => {
        let el = document.getElementById('macro-name')
        if (!el) {
          return false
        }
        el.innerText = name
        el = document.getElementById('macro-description')
        if (!el) {
          return false
        }
        el.innerHTML = description
      },
      name,
      descriptionHtml,
    )

    if (!result) {
      throw new Error(`Cannot render the description of ${name}.`)
    }

    // set the viewport to the same size as the page
    const { width, height } = await page.evaluate(() => {
      const ele = document.body
      return {
        width: ele.scrollWidth,
        height: ele.scrollHeight,
      }
    })
    await page.setViewport({
      width,
      height,
    })

    // take a screenshot
    const screenshot = await page.screenshot({
      fullPage: true,
      type: 'png',
    })

    // don't forget to close the page
    await page.close()
    return segment.image(screenshot)
  }
}
