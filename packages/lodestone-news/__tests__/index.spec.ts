import { expect } from 'chai'
import getNews, { locales } from '../src'

describe('lodestone-news', () => {
  locales.forEach((locale) => {
    it(`should get ${locale} news`, async () => {
      const resp = await getNews(locale)
      const { news, page } = resp
      expect(news).is.an('array')
      expect(news).has.length.greaterThan(0)
      expect(news[0]).has.property('title').which.is.a('string')
      expect(news[0]).has.property('epoch').which.is.a('number')
      expect(news[0]).has.property('url').which.is.a('string')
      expect(news[0]).has.property('date').which.is.a('date')

      expect(page).has.property('current').which.is.a('number').greaterThan(0)
      expect(page).has.property('total').which.is.a('number').greaterThan(0)
    }).timeout(0)
  })
})
