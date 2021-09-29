import { urlToFilename, save } from '../lib/utils.js'
import { describe, it, before, after } from 'mocha'
import { expect } from 'chai'

const { log, error } = console

describe('Functional test',() => {
  it('urlFileName function should return a correct filename', () => {
    const url = 'https://loige.co'
    const filename = urlToFilename(url)
    expect(filename).to.be.equal('loige.co.html')
  })

  describe('File saving test', () => {
    before(() => {
      // const url = 'https://loige.co'
      // const filename = urlToFilename(url)
      // save(filename, 'CONTENT TEST', (err, filename, downloaded) => {
      //   if (err) return error(err)
      //   if (downloaded) return log(`saved "${filename}"`)

      // })
      log('BEFORE')
    })

    after(() => {
      log('AFTER')
    })
    it('Should save function should save file correctly')
  })

  describe('Download content test', () => {
    it('Should download content from url and save the file correctly')
  })
})
