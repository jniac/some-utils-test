#!/usr/bin/env node

import chokidar from 'chokidar'
import { spawn } from './src/spawn.mjs'

let buildPromise = null
const build = async () => {
  await buildPromise
  const now = Date.now()
  await (buildPromise = spawn(`node scripts/build.mjs`))
  const dt = Date.now() - now
  console.log(`build ${dt}ms`)
}

let testPromise = null
const test = async () => {
  await testPromise
  const now = Date.now()
  await (testPromise = spawn(`yarn test`))
  const dt = Date.now() - now
  console.log(`test ${dt}ms`)
}

const main = async () => {

  chokidar.watch('src/some-utils').on('change', path => {
    console.log(`change: ${path}`)
    build()
  })
  
  chokidar.watch('src/some-tests').on('change', path => {
    console.log(`change: ${path}`)
    test()
  })
}

main()
