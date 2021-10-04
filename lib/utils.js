import { URL } from 'url'
import slug from 'slug'
import path from 'path'
import fs from 'fs'
import superagent from 'superagent'
import cheerio from 'cheerio'
import { spiderV2 } from './spider.js'

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

/**
 * 
 * @param {string} url - a url link 
 * @param {*} element - element we ant to parse from webpage
 */

export function getLinkUrl(url, element) {
  const parsedLink = new URL(element.attribs?.href || '', url)
  const currentParsedUrl = new URL(url)
  if (parsedLink.hostname !== currentParsedUrl.hostname ||
    !parsedLink.pathname) {
    return null
  }
  return parsedLink.toString()
}

/**
 * Get the list of links into a webpage
 * 
 * @param {string} url - a url link 
 * @param {string} body - content of the url page
 */

export function getPageLinks(url, body) {
  return Array.from(cheerio.load(body)('a'))
    .map(element => {
      return getLinkUrl(url, element)
    })
    .filter(Boolean)
}

/**
 * Iterate on a list of webpage links recursively
 * 
 * @param {*} url - a url link
 * @param {*} body - content of the url page
 * @param {*} nesting - level of depth of spider
 * @param {*} cb - function to call once finished
 */

export function spiderLinks(url, body, nesting, cb) {
  if (nesting === 0) {
    return process.nextTick(cb)
  }
  const links = getPageLinks(url, body)

  if (links.length === 0) {
    return process.nextTick(cb)
  }

  function iterate(index) {
    if (index === links.length) {
      return cb()
    }
    spiderV2(links[index], nesting - 1, err => {
      if (err) return cb(err)
      iterate(index + 1)
    })
  }
  iterate(0)
}