import { urlToFilename, 
  save,
  download, 
  getLinkUrl,
  getPageLinks } from '../lib/utils.js'
import { describe, it, afterEach } from 'mocha'
import { expect } from 'chai'
import fs from 'fs'

const { error, log } = console

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

    it('Should download content properly from url', (done) => {
      download(url, filename, (err, data) => {
        if (err) done(err)
        expect(data).to.not.be.undefined
        done()
      })
    })

    afterEach(() => {
      fs.unlink(filename, err => {
        if (err) return error(err)
        log(`Deleted ${filename}`)
      })
    })
  })

  describe('', () => {
    it('Should get url links', () => {
      const parsedLinks = getLinkUrl(url, 'a')
      expect(parsedLinks).to.not.be.undefined
    })
  
    it('Should parse body links', (done) => {
      fs.readFile('./test/loige.co.for.test.html', (err, data) => {
        if (err) done(err)
        const pageLinks = getPageLinks(url, data)
        expect(pageLinks).to.not.be.undefined
        expect(pageLinks).to.be.an('array')
        pageLinks.forEach(link => {
          expect(link).to.not.be.null
          expect(link).to.be.an('string')
          expect(link).to.not.be.empty
        })
        done()
      })
    })
  })
})
