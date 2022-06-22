import path from 'path'

import type {} from '@koishijs/plugin-puppeteer'
import { closest } from 'fastest-levenshtein'
import { Context, Service, segment } from 'koishi'

import { parseMacroDescriptionForHtml } from './parser'
import { Locale, commandPrefixKeys, locales } from './utils'

interface MacroWithoutDescription {
  id: number
  names: string[]
}
interface Macro {
  id: number
  name: string
  description: string
  /** used to determine the input is exactly the same as the result */
  exactly?: boolean
}

export class Search extends Service {
  macros?: Record<Locale, MacroWithoutDescription[]>

  constructor(ctx: Context) {
    super(ctx, 'macrodict', true)

    this.ctx.on(
      'macrodict/update',
      async () => (this.macros = await this.getNames()),
    )
  }

  async getNames(): Promise<Record<Locale, MacroWithoutDescription[]>> {
    const db = await this.ctx.database.get('macrodict', {}, [
      'id',
      ...commandPrefixKeys,
    ])

    const ret: Record<Locale, MacroWithoutDescription[]> = {
      en: [],
      de: [],
      fr: [],
      ja: [],
      chs: [],
      ko: [],
    }

    for (const row of db) {
      const { id } = row

      // initialize macro metadata container
      for (const lang of locales) {
        ret[lang].push({
          id,
          names: [],
        })
      }

      for (const key of commandPrefixKeys) {
        const loc = key.substring(key.lastIndexOf('_') + 1) as Locale
        ret[loc][ret[loc].length - 1].names.push(row[key])
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

  async search(name: string, lang: Locale): Promise<Macro | undefined> {
    if (!this.macros) {
      this.macros = await this.getNames()
    }

    const predict = closest(
      name,
      this.macros[lang].map((macro) => macro.names).flat(),
    )

    if (!predict) {
      return
    }

    const exactly = predict === name || predict.substring(1) === name

    const id = this.macros[lang].find(({ names }) =>
      names.includes(predict),
    )?.id

    if (!id) {
      return
    }

    const macro = await this.get(id, lang)

    if (!macro) {
      return
    }

    return {
      ...macro,
      exactly,
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
        return true
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
