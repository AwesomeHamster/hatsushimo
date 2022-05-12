import { expect } from 'chai'
import { App } from 'koishi'
import mock from '@koishijs/plugin-mock'
import * as memory from '@koishijs/plugin-database-memory'

import { fetchCnMacros, fetchIntlMacros, fetchKoMacros } from '../src/update'

describe('update', () => {
  const app = new App()

  app.plugin(memory)
  app.plugin(mock)

  const client = app.mock.client('123')
  const ctx = client.mock.ctx

  before(async () => app.start())

  it('fetch international macros', async () => {
    const data = await fetchIntlMacros(ctx)
    expect(data.length).greaterThan(0)
  })
    .timeout(0)
    .retries(3)

  it('fetch chinese macros', async () => {
    const data = await fetchCnMacros(ctx)
    expect(data.length).greaterThan(0)
  })
    .timeout(0)
    .retries(3)

  it('fetch korean macros', async () => {
    const data = await fetchKoMacros(ctx)
    expect(data.length).greaterThan(0)
  })
    .timeout(0)
    .retries(3)

  after(() => app.stop())
})
