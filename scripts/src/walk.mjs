import fs from 'fs'
import path from 'path'

/**
 * @async
 * @generator
 * @param {string} dir
 * @yields {string}
 */
export async function* walk(dir) {
  for await (const entry of await fs.promises.opendir(dir)) {
    const filepath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      yield* walk(filepath)
    }
    else if (entry.isFile()) {
      yield filepath
    }
  }
}
