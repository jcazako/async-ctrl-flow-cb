import fs from 'fs'
import { urlToFilename, download } from './utils.js'


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