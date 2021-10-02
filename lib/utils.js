import { URL } from 'url'
import slug from 'slug'
import path from 'path'
import fs from 'fs'
import superagent from 'superagent'

/**
 * Convert a url into a string usable for the creation of a html file
 * 
 * @param {string} url 
 */

export function urlToFilename(url) {
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

/**
 * Save content into a file
 * 
 * @param {string} filename 
 * @param {*} content 
 */

export function save(filename, content, cb) {
  fs.mkdir(path.dirname(filename), {recursive: true}, err => {
    if (err) {
      return cb(err)
    }
    fs.writeFile(filename, content, cb)
  })
}

/**
 *
 * Download and save url content
 *  
 * @param {string} url 
 * @param {string} filename 
 * @param {function} cb 
 */

export function download(url, filename, cb) {
  console.log(`Downloading ${filename}`)
  superagent.get(url).end((err, res) => {
    if (err) return cb(err)
    save(filename, res.text, err => {
      if (err) return cb(err)
      console.log(`Downloaded and saved: ${url}`)
      cb(null, res.text)
    })
  })
}