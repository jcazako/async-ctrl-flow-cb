import { urlToFilename } from '../lib/utils.js'
import { describe, it } from 'mocha'
import { expect } from 'chai'

/**
 * Test the urlFileName function
 */

describe('Test urlToFilename',() => {
  it('Should return correct filename', () => {
    const url = 'https://loige.co'
    const filename = urlToFilename(url)
    expect(filename).to.be.equal('loige.co.html')
  })
})
