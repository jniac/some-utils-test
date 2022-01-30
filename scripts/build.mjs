#!/usr/bin/env node

import fs from 'fs'
import { spawn } from './src/spawn.mjs'
import { walk } from './src/walk.mjs'

const main = async () => {

  await spawn(`tsc --project tsconfig-build.json`)

  for await (const file of walk('public/some-utils')) {
    if (file.endsWith('.js')) {
      const data = await fs.promises.readFile(file, 'utf-8')
      const newData = data.replace(/(import|export .* from\s+['"])(.*)(?=['"])/g, '$1$2.js')
      await fs.promises.writeFile(file, newData, 'utf-8')
    }
  }
}

main()
