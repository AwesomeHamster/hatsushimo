import { expect } from 'chai'
import { App } from 'koishi'
import mock from '@koishijs/plugin-mock'
import * as memory from '@koishijs/plugin-database-memory'

import { Updater } from '../src/update'
import * as macrodict from '../src'

describe('macrodict', () => {
  const app = new App()

  app.plugin(mock)
  app.plugin(memory)
  app.plugin(macrodict)

  const client = app.mock.client('123')
  const ctx = client.mock.ctx
  const updater = new Updater(ctx, {})

  before(async () => {
    app.start()
  })

  after(() => app.stop())

  describe('update', () => {
    it('fetch international macros', async () => {
      const data = await updater.fetchIntl()
      expect(data.length).greaterThan(0)
    })
      .timeout(0)
      .retries(3)

    it('fetch chinese macros', async () => {
      const data = await updater.fetchCn()
      expect(data.length).greaterThan(0)
    })
      .timeout(0)
      .retries(3)

    it('fetch korean macros', async () => {
      const data = await updater.fetchKo()
      expect(data.length).greaterThan(0)
    })
      .timeout(0)
      .retries(3)

    it('update database', async () => {
      const count = await updater.update()
      expect(count).greaterThan(0)
    })
      .timeout(0)
      .retries(3)
  })
})
