import fs from 'fs'
import { urlToFilename, download } from './utils.js'

/**
 * Download and save the content of a webpage in a file
 * 
 * @param {string} url - url we want to download from 
 * @param {function} cb - function to send control once spider is done
 */

export function spider(url, cb) {
  const filename = urlToFilename(url)
  fs.access(filename, err => {
    if (err && err.code === 'ENOENT') {
      download(url, filename, err => {
        if (err) return cb(err)
        cb(null, filename, true)
      })
    } else {
      cb(null, filename, false)
    }
  })
}

/**
 * 
 * Download and save recursively the content of a webpage in a file
 * 
 * @param {string} url - url we want to download from
 * @param {number} nesting - Level a depth we want to crawl into the websites
 * @param {function} cb - function to send control once spider is done
 */

export function spiderV2(url, nesting, cb) {
  const filename = urlToFilename(url)

  fs.readFile(filename, (err, fileContent) => {
    if (err) {
      if (err.code !== 'ENOENT') {
        return cb(err)
      }

      // the file doesn't exist let's download it
      download(url, filename, (err, requestContent) => {
        if (err) return cb(err)

      })
    }
    // the file already exist lets process the links then
  })
}