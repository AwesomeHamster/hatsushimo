import { Search } from './search'
import { CommandPrefix, LocalizedKeys } from './utils'

export type MacroDictDatabase = Record<
  LocalizedKeys<CommandPrefix | 'Description'>,
  string
> & {
  id: number
  lastUpdated: number
}

declare module 'koishi' {
  interface Tables {
    macrodict: MacroDictDatabase
  }

  namespace Context {
    interface Services {
      macrodict: Search
    }
  }

  interface Events {
    /* eslint-disable @typescript-eslint/naming-convention */
    'macrodict/update': () => void
    /* eslint-enable @typescript-eslint/naming-convention */
  }
}
