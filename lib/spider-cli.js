import { spiderV3 } from './spider.js'
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

function finish(err) {
  if (err) {
    return error(err)
  }
  log('Finish')
}

log('Using spider v3')
spiderV3(options.url, options.nesting || 1, finish)
