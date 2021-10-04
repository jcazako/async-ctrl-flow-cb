import { spider, spiderV2 } from './spider.js'
import { Command } from 'commander/esm.mjs'

const program = new Command()

program
  .option('-v, --version number', 'Specifies what version of spider you want to use', 1)
  .option('-u, --url string', 'What url do you want to download from')

program.parse(process.argv)

const options = program.opts()

let spiderRunner = (options.version === 2) ? spiderV2 : spider

const { log, error } = console

spiderRunner(options.url, (err, filename, downloaded) => {
  if (err) {
    return error(err)
  }
  if (downloaded) {
    return log(`Completed the download of "${filename}"`)
  }
  log(`"${filename}" was already downloaded`)
})