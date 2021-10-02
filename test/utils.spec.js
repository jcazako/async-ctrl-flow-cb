import { urlToFilename, save } from '../lib/utils.js'
import { describe, it, after } from 'mocha'
import { expect } from 'chai'
import fs from 'fs'

const { error } = console

describe('Functional test',() => {
  const url = 'https://loige.co'
  const filename = urlToFilename(url)
  const sampleTest = 'CONTENT_TEST'
  
  it('urlFileName function should return a correct filename', () => {
    expect(filename).to.be.equal('loige.co.html')
  })

  describe('File saving test', () => {
    it('Should save the file correctly', (done) => {
      save(filename, sampleTest, (err) => {
        expect(err).to.be.null
        fs.readFile(filename, (err, content) => {
          if (err) done(err)
          expect(content.toString()).to.be.equal(sampleTest)
        })
        done()
      })
    })

    after(() => {
      fs.unlink(filename, err => {
        if (err) return error(err)
      })
    })
  })
})
