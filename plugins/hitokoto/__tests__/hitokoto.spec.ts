import { App } from 'koishi'
import mock from '@koishijs/plugin-mock'
import memory from '@koishijs/plugin-database-memory'

import * as hitokoto from '..'

describe('basic', () => {
  const app = new App()

  app.plugin(mock)
  app.plugin(memory)
  app.plugin(hitokoto, {
    apiUrl: 'https://international.v1.hitokoto.cn/',
  })

  const client = app.mock.client('123')

  before(() => app.start())

  it('should reply hitokoto', async () => {
    await client.shouldReply('hitokoto')
  })
})
