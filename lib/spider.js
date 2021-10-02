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