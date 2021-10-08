import fs from 'fs'
import { urlToFilename, download, getPageLinks } from './utils.js'


const spiderCache = new Set()

export function spiderV3Links(url, body, nesting, cb) {
  if (nesting === 0) {
    return process.nextTick(cb)
  }
  
  const links = getPageLinks(url, body)

  if (links.length === 0) {
    return process.nextTick(cb)
  }

  let running = 0
  let hasError = false
  const concurrency = 4
  let index = 0
  let completed = 0

  function done(err) {
    if (err) {
      hasError = true
      return cb()
    }
    if (++completed === links.length && !hasError) {
      return cb()
    }
    running--
    next() 
  }

  function next() {
    while (running < concurrency && index < links.length) {
      const link = links[index++]
      spiderV3(link, nesting - 1, done)
      running++
    }
  }
  next()
}

/**
 * 
 * Download and save recursively the content of a webpage in a file
 * 
 * @param {string} url - url we want to download from
 * @param {number} nesting - Level a depth we want to crawl into the websites
 * @param {function} cb - function to send control once spider is done
 */

export function spiderV3(url, nesting, cb) {
  const filename = urlToFilename(url)

  fs.readFile(filename, (err, fileContent) => {
    if (err) {
      if (err.code !== 'ENOENT') {
        return cb(err)
      }

      // if the file doesn't exist and it's not being downloaded
      if (!spiderCache.has(filename)) {
        spiderCache.add(filename)
        return download(url, filename, (err, requestContent) => {
          if (err) return cb(err)
          spiderCache.delete(filename)
          spiderV3Links(url, requestContent, nesting, cb)
        })
      }
    }
    // the file already exist lets process the links then
    spiderV3Links(url, fileContent, nesting, cb)
  })
}