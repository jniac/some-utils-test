import tap from 'tap'
import { Interval } from '../../some-utils/geom/Interval'

tap.test('set, safeSet, equals, equivalent', test => {

  // default interval is [0, 1]
  test.equal(new Interval().equivalent([0, 1]), true)

  const interval = new Interval(10, 12)
  test.equal(Interval.ensure(interval), interval) // ensure should return the same reference, when the reference is an instance of Interval
  test.equal(interval.equals(new Interval(10, 12)), true)
  test.equal(interval.equivalent([10, 12]), true)
  test.equal(new Interval(12, 10, { mode: 'swap'}).equivalent([10, 12]), true)
  test.equal(new Interval(12, 10, { mode: 'collapse'}).equivalent([11, 11]), true)
  test.equal(new Interval(12, 10).equivalent([11, 11]), true)
  test.equal(new Interval({ min: 12, max: 10 }).equivalent([11, 11]), true)
  test.equal(new Interval({ min: 12, max: 10 }).equivalent([11, 11]), true)
  test.equal(new Interval({ center: 10, length: 4 }).equivalent([8, 12]), true)
  test.equal(new Interval(10, 12).set({}).equivalent([0, 1]), true)
  // @ts-ignore
  test.throws(() => new Interval().set(3))
  test.end()
  
})

tap.test('getter', test => {

  test.equal(new Interval(10, 12).center, 11)
  test.equal(new Interval(10, 12).length, 2)
  test.end()

})

tap.test('isDegenerate', test => {
  
  const interval = new Interval()
  interval.min = 12
  interval.max = 10
  test.equal(interval.isDegenerate(), true)
  test.end()

})

tap.test('containsValue, contains', test => {
  
  const interval = new Interval(10, 14)
  test.equal(interval.containsValue(11), true)
  test.equal(interval.containsValue(9), false)
  test.equal(interval.contains([11, 13]), true)
  test.equal(interval.contains([9, 13]), false)
  test.end()

})

tap.test('union, intersection', test => {
  
  const interval = new Interval(10, 14)
  test.equal(interval.union([15, 16]).equivalent([10, 16]), true)
  test.equal(interval.intersection([12, 16]).equivalent([12, 14]), true)
  test.equal(interval.intersection([16, 30]).equivalent([15, 15]), true)
  test.end()

})

tap.test('distance, uncovered', test => {

  test.equal(new Interval(10, 12).signedDistanceToValue(8), -2)
  test.equal(new Interval(10, 12).signedDistanceToValue(15), 3)
  test.equal(new Interval(10, 12).signedDistanceToValue(11), 0)
  test.equal(new Interval(10, 12).signedDistance([4, 7]), -3)
  test.equal(new Interval(10, 12).signedDistance([14, 17]), 2)
  test.equal(new Interval(10, 12).signedDistance([11, 13]), 0)
  test.equal(new Interval(10, 12).signedGreatestDistance([4, 7]), -5)
  test.equal(new Interval(10, 12).signedGreatestDistance([14, 17]), 4)
  test.equal(new Interval(10, 14).coverLength([-10, 8]), 0)
  test.equal(new Interval(10, 14).coverLength([11, 15]), 3)
  test.equal(new Interval(10, 14).coverRatio([11, 15]), 0.75)
  test.end()

})
