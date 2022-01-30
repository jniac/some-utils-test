import tap from 'tap'
import { Point } from '../../some-utils/geom/Point'

tap.test('constructor, set, equals, ensure, copy, clone', test => {

  const point = new Point(3, 4)
  test.equal(point.equals(new Point().set(3, 4)), true)
  test.equal(point.clone().set({}).equivalent([0, 0]), true)
  test.equal(point.clone().set([2, 3]).equivalent([2, 3]), true)
  // @ts-ignore
  test.throws(() => new Point().set(3))
  // @ts-ignore
  test.throws(() => new Point().set(3, 4, 5))
  test.equal(Point.ensure(point), point)
  test.equal(Point.ensure([3, 4]).clone().equals(point), true)
  test.equal(new Point().copy(point).equals(point), true)
  test.end()

})

tap.test('add, subtract', test => {

  const point = new Point(3, 4)
  test.equal(point.add([1, 2]).equivalent([4, 6]), true)
  test.equal(point.subtract([1, 2]).equivalent([2, 2]), true)
  test.end()

})
