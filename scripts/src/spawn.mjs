import * as cp from 'child_process'

/**
 * Spawn use one line of arguments, split afterwards into command and args.
 * @param {string} line 
 */
export const spawn = (line, {
  splitArg = /\s+/,
} = {}) => new Promise(resolve => {
  const [command, ...args] = line.split(splitArg)
  const child = cp.spawn(command, args, { env : { ...process.env, FORCE_COLOR: true } })
  child.stdin.pipe(process.stdin)
  child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)
  let out = ''
  child.stdout.on('data', chunk => out += chunk)
  child.on('close', () => resolve(out))
})
