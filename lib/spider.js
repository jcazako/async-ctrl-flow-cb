import fs from 'fs'
import path from 'path'
import superagent from 'superagent'
import mkdirp from 'mkdirp'
import { urlToFilename } from './utils.js';

export function spider(url) {
  const filename = urlToFilename(url)
  return filename
}