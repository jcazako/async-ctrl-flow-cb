import { spider, spiderV2 } from './spider.js'
import { Command } from 'commander/esm.mjs'

const { log, error } = console

const program = new Command()

program
  .option('-v, --version <version>', 'Specifies what version of spider you want to use', 1)
  .requiredOption('-u, --url <url>', 'What url do you want to download from')
  .option('-n, --nesting <nesting>', 'Level of depth')

program.parse(process.argv)

const options = program.opts()

log(options)

function finish(err, filename, downloaded) {
  if (err) {
    return error(err)
  }
  if (downloaded) {
    return log(`Completed the download of "${filename}"`)
  }
  log(`"${filename}" was already downloaded`)
}

if(parseInt(options.version) === 2) {
  log('Using spider v2')
  spiderV2(options.url, options.nesting || 1, finish)
} else {
  log('Using spider v1')
  spider(options.url, finish)
}