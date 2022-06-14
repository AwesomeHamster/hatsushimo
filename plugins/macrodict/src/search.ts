import { Context, Service } from 'koishi'
import { Locale } from '.'

export class Search extends Service {
  constructor(ctx: Context) {
    super(ctx, 'macrodict', true)
  }

  async get(id: number, lang: Locale) {
    return await this.ctx.database.get('macrodict', {
      id: { $eq: id },
    }, ['id', `Description_${lang}`])
  }

  async search(name: string, lang: Locale) {
    return await this.ctx.database.get(
      'macrodict',
      {
        $or: [
          { [`Command_${lang}`]: { $eq: name } },
          { [`ShortCommand_${lang}`]: { $eq: name } },
          { [`Alias_${lang}`]: { $eq: name } },
          { [`ShortAlias_${lang}`]: { $eq: name } },
          /* eslint-disable @typescript-eslint/naming-convention */
          { Command_en: { $eq: name } },
          { ShortCommand_en: { $eq: name } },
          { Alias_en: { $eq: name } },
          { ShortAlias_en: { $eq: name } },
          /* eslint-enable @typescript-eslint/naming-convention */
        ],
      },
      [`Command_${lang}`, `Description_${lang}`, 'id'],
    )
  }
}
