import { parseStream } from '@fast-csv/parse'
import { Context, Logger } from 'koishi'

import type {} from './index'

export type XivapiResponse<T = any> = {
  /* eslint-disable @typescript-eslint/naming-convention */
  Pagination: {
    Page: number
    PageNext: number | null
    PagePrev: number | null
    PageTotal: number
    Results: number
    ResultsPerPage: number
    ResultsTotal: number
  }
  Results: T[]
  /* eslint-enable @typescript-eslint/naming-convention */
}

export type Fields =
  | 'Command'
  | 'ShortCommand'
  | 'Alias'
  | 'ShortAlias'
  | 'Description'

export type IntlMacros = Record<
  `${Fields}_${'en' | 'de' | 'fr' | 'ja'}` | 'ID',
  string
>

const logger = new Logger('macrodict')

export async function updateMacros(ctx: Context): Promise<void> {
  logger.info('start updating macros')
  const macros = normalizeMacros(await fetchIntlMacros(ctx))
  const cnMacros = normalizeMacros(await fetchCnMacros(ctx))
  const koMacros = normalizeMacros(await fetchKoMacros(ctx))
  for (const [id, macro] of [
    ...Object.entries(cnMacros),
    ...Object.entries(koMacros),
  ]) {
    if (id in macros) {
      macros[id] = { ...macros[id], ...macro }
    } else {
      macros[id] = macro as any
    }
  }
  await ctx.database.upsert('macrodict', Object.values(macros))
  logger.info('macros updated')
}

export async function fetchXivapi<T>(
  ctx: Context,
  url: string,
  columns: string[],
): Promise<T[]> {
  const ret: T[] = []
  let data = await ctx.http.get<XivapiResponse<T>>(url, {
    params: { columns: columns.join(',') },
  })
  ret.push(...data.Results)
  while (data && data.Pagination.PageNext) {
    data = await ctx.http.get<XivapiResponse<T>>(url, {
      params: { columns: columns.join(','), page: data.Pagination.PageNext },
    })
    ret.push(...data.Results)
  }
  return ret
}

export async function fetchIntlMacros(ctx: Context): Promise<IntlMacros[]> {
  const data = await fetchXivapi<IntlMacros>(
    ctx,
    'https://xivapi.com/TextCommand',
    [
      'ID',
      ...['en', 'de', 'fr', 'ja'].reduce<string[]>((arr, loc) => {
        arr.push(
          `Command_${loc}`,
          `ShortCommand_${loc}`,
          `Alias_${loc}`,
          `ShortAlias_${loc}`,
          `Description_${loc}`,
        )
        return arr
      }, []),
    ],
  )
  return data
}

export async function fetchCnMacros(
  ctx: Context,
): Promise<Record<`${Fields}_chs` | 'ID', string>[]> {
  const data = await fetchXivapi<Record<`${Fields}_chs` | 'ID', string>>(
    ctx,
    'https://cafemaker.wakingsands.com/TextCommand',
    [
      'ID',
      'Command_chs',
      'ShortCommand_chs',
      'Alias_chs',
      'ShortAlias_chs',
      'Description_chs',
    ],
  )
  return data
}

export async function fetchKoMacros(
  ctx: Context,
): Promise<Record<`${Fields}_ko` | 'ID', string>[]> {
  const content = await ctx.http.get<NodeJS.ReadableStream>(
    'https://cdn.jsdelivr.net/gh/Ra-Workspace/ffxiv-datamining-ko@master/csv/TextCommand.csv',
    {
      responseType: 'stream',
    },
  )

  const rows = await new Promise<Record<`${Fields}_ko` | 'ID', string>[]>(
    (resolve, reject) => {
      const rows: Record<`${Fields}_ko` | 'ID', string>[] = []
      parseStream(content, {
        skipLines: 1,
        ignoreEmpty: false,
        headers: true,
      })
        .on('error', (err) => reject(err))
        .on('data', (row) => {
          // CSV files from SaintCoinach has the first 3 rows as headers,
          // but only the second row is useful for naming.
          // the third row is type information, which we don't need.
          // `#` column is the ID, which is always number.
          if (/^[0-9]+$/.test(row?.['#'])) {
            rows.push({
              /* eslint-disable @typescript-eslint/naming-convention */
              ID: row?.['#'],
              Alias_ko: row.Alias,
              Command_ko: row.Command,
              Description_ko: row.Description,
              ShortAlias_ko: row.ShortAlias,
              ShortCommand_ko: row.ShortCommand,
              /* eslint-enable @typescript-eslint/naming-convention */
            })
          }
        })
        .on('end', (rowCount: number) => {
          if (rowCount === 0) reject(new Error('csv reads no data'))

          resolve(rows)
        })
    },
  )

  return rows
}

/**
 * Transforms the raw data from xivapi or github to a shape like:
 * `{ 1: { id: "1", Command_en: "command", ShortCommand_en: "short-command", ... }}`
 */
export function normalizeMacros<T extends { ID?: string }>(
  macros: T[],
): Record<string, Omit<T, 'ID'> & { id: number }> {
  const map = new Map<string, T & { id: number }>()
  for (const macro of macros) {
    const id = macro.ID
    delete macro.ID
    if (id) {
      map.set(id, {
        id: Number(id),
        ...macro,
      })
    }
  }
  return Object.fromEntries(map)
}
