import { App } from 'koishi'
import mock from '@koishijs/plugin-mock'
import * as memory from '@koishijs/plugin-database-memory'

import * as macrodict from '..'

describe('basic', async () => {
  const app = new App()

  app.plugin(mock)
  app.plugin(memory)
  app.plugin(macrodict)

  await app.start()

  const client = app.mock.client('123')

  before(async () => app.start())

  it('should render macro view', async () => {
    await client.shouldReply('macrodict hotbar')
  })
})
