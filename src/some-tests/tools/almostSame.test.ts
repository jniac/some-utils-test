import tap from 'tap'
import { almostSame, AlmostSameStatus } from './almostSame'

tap.test('almostSame', test => {

  const equal = (a: AlmostSameStatus, b: AlmostSameStatus) => test.equal(a, b)

  equal(almostSame(null, null), 'ok')
  equal(almostSame(null, undefined), 'different-values')
  equal(almostSame(undefined, null), 'different-values')

  equal(almostSame(1, 1), 'ok')
  equal(almostSame(1, 1 + 1e-14), 'ok')
  equal(almostSame(1, 2), 'different-values')
  equal(almostSame(1, '2'), 'different-types')
  equal(almostSame({ x: 1 }, { x: 1, y: 2 }), 'different-key-count')
  equal(almostSame({ x: 1 }, { y: 2 }), 'different-key-names')
  equal(almostSame(
    { x: { y: 2 } }, 
    { x: { z: 2 } },
  ), 'different-key-names')
  equal(almostSame(
    { x: true }, 
    { x: true },
  ), 'ok')
  equal(almostSame(
    { x: true }, 
    { x: false },
  ), 'different-values')

  test.end()
})