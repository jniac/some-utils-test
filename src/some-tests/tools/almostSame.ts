export type AlmostSameStatus = 'ok' | 'different-key-count' | 'different-key-names' | 'different-types' | 'different-values'

export const almostSame = (a: any, b: any, options = {
  epsilon: 1e-12,
}): AlmostSameStatus => {

  if (a === null || a === undefined) {
    return b === a ? 'ok' : 'different-values'
  }

  const type = typeof a
  if (typeof b !== type) {
    return 'different-types'
  }

  switch (type) {
    case 'number': {
      const d = Math.abs(b - a)
      return d < options.epsilon ? 'ok' : 'different-values'
    }
    case 'object': {
      const aKeys = Object.keys(a)
      const bKeys = Object.keys(b)
      if (aKeys.length !== bKeys.length) {
        return 'different-key-count'
      }
      if (aKeys.every(k => bKeys.includes(k)) === false) {
        return 'different-key-names'
      }
      for (let i = 0, max = aKeys.length; i < max; i++) {
        const k = aKeys[i]
        const result = almostSame(a[k], b[k], options)
        if (result !== 'ok') {
          return result
        }
      }
      return 'ok'
    }
    default: {
      return a === b ? 'ok' : 'different-values'
    }
  }
}
