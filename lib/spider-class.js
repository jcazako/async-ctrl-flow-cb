import { URL } from 'url'
import slug from 'slug'
import path from 'path'
import fs from 'fs'
import superagent from 'superagent'
import cheerio from 'cheerio'

export class Spider {
  constructor(concurrency) {
    this.index = 0
    this.completed = 0
    this.concurrency = concurrency
    this.running = 0
  }

  urlToFilename(url) {
    const parsedUrl = new URL(url)
    const urlPath = parsedUrl.pathname.split('/')
      .filter(function (component) {
        return component !== ''
      })
      .map(function (component) {
        return slug(component, { remove: null })
      })
      .join('/')
    let filename = path.join(parsedUrl.hostname, urlPath)
    if (!path.extname(filename).match(/htm/)) {
      filename += '.html'
    }
    return filename
  }

  save(filename, content, cb) {
    fs.mkdir(path.dirname(filename), {recursive: true}, err => {
      if (err) {
        return cb(err)
      }
      fs.writeFile(filename, content, cb)
    })
  }

  download(url, filename, cb) {
    console.log(`Downloading ${filename}`)
    superagent.get(url).end((err, res) => {
      if (err) return cb(err)
      this.save(filename, res.text, err => {
        if (err) return cb(err)
        console.log(`Downloaded and saved: ${url}`)
        cb(null, res.text)
      })
    })
  }

  getLinkUrl(url, element) {
    const parsedLink = new URL(element.attribs?.href || '', url)
    const currentParsedUrl = new URL(url)
    if (parsedLink.hostname !== currentParsedUrl.hostname ||
      !parsedLink.pathname) {
      return null
    }
    return parsedLink.toString()
  }

  getPageLinks(url, body) {
    return Array.from(cheerio.load(body)('a'))
      .map(element => {
        return this.getLinkUrl(url, element)
      })
      .filter(Boolean)
  }

  done() {

  }

  next() {

  }

  spiderV3Links(url, body, nesting, cb) {

  }

  spiderV3() {
    
  }

  run() {

  }
}