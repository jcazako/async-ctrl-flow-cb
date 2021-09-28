import { spider } from './spider.js'

const { log, error } = console

spider(process.argv[2], (err, filename, downloaded) => {
  if (err) {
    return error(err)
  }
  if (downloaded) {
    return log(`Completed the download of "${filename}"`)
  }
  log(`"${filename}" was already downloaded`)
})