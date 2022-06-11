import { expect } from 'chai'
import { App } from 'koishi'
import mock from '@koishijs/plugin-mock'

import { Updater } from '../src/update'

describe('update', () => {
  const app = new App()

  app.plugin(mock)

  const client = app.mock.client('123')
  const ctx = client.mock.ctx
  const updater = new Updater(ctx, {})

  before(async () => {
    app.start()
  })

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

  after(() => app.stop())
})
