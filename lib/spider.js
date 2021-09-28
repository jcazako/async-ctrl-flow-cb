import fs from 'fs'
import path from 'path'
import superagent from 'superagent'
import mkdirp from 'mkdirp'
import { urlToFilename } from './utils.js'

const { log } = console

export function spider(url, cb) {
  const filename = urlToFilename(url)
  fs.access(filename, err => {
    if (err && err.code === 'ENOENT') {
      log(`Downloading "${filename}"`)
      superagent.get(url).end((err, res) => {
        if (err) {
          return cb(err)
        }
        mkdirp(path.dirname(filename), err => {
          if (err) {
            return cb(err)
          }
          fs.writeFile(filename, res.text, err => {
            if (err) {
              return cb(err)
            }
            cb(null, filename, true)
          } )
        })
      })
    } else {
      cb(null, filename, false)
    }
  })
}