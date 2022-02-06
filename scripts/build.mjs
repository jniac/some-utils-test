#!/usr/bin/env node

import fs from 'fs'
import { spawn } from './src/spawn.mjs'
import { walk } from './src/walk.mjs'

/**
 * @param {string} str 
 */
const addJsExtension = str => str.replace(/(import|export .* from\s+['"])(.*)(['"])/g, (_, m1, m2, m3) => (
  m1 + m2.replace(/.js$/, '') + '.js' + m3
))

const main = async () => {

  await spawn(`tsc --project scripts/tsconfig/tsconfig-geom.json`)
  await spawn(`tsc --project scripts/tsconfig/tsconfig-math.json`)

  for await (const file of walk('public/some-utils')) {
    if (file.endsWith('.js')) {
      const data = await fs.promises.readFile(file, 'utf-8')
      const newData = addJsExtension(data)
      await fs.promises.writeFile(file, newData, 'utf-8')
    }
  }
}

main()
