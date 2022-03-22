import { injectable } from 'inversify'
import 'reflect-metadata'
import { Context, template } from 'koishi'
import { eorzeaContainer } from '../../../ioc/inversify.config'
import { KoishiBaseInterface } from '../../../base/koshiBase'
import { EorzeaTimeTypes } from '../eorzeaTimeTypes'
import { EorzeaTimeService } from '../service/eorzeaTimeService'

interface KoishiEorzeaTimeInterface extends KoishiBaseInterface {}

@injectable()
export class KoishiEorzeaTimeSerivce implements KoishiEorzeaTimeInterface {
  templateName = 'eorzeaTime'

  template = {
    description: '艾欧泽亚时间',
    format: '现在艾欧泽亚时间是 {{eorzeaTime}}',
  }

  commandName = 'eorzea.time'

  alias = ['et']

  init(context: Context) {
    template.set(this.templateName, this.template)
    context
      .command(this.commandName, this.description())
      .alias(...this.alias)
      .action(() => {
        return this.action()
      })
  }

  description(): string {
    return template(this.templateName + '.description')
  }

  action(): string {
    let data = {
      eorzeaTime: eorzeaContainer
        .get<EorzeaTimeService>(EorzeaTimeTypes.EorzeaTimeInterface)
        .getEorzeaTimeWithLocalTime(),
    }
    return template(this.templateName + '.format', data)
  }
}
