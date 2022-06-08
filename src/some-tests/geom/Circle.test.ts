import tap from 'tap'
import { Circle } from '../../some-utils/geom/Circle'

tap.test('Circle(), ensure, constructor', test => {

  test.same(new Circle(), { x: 0, y: 0, r: 1 })
  test.same(new Circle(3), { x: 0, y: 0, r: 3 })
  test.same(new Circle(3, 4, 5), { x: 3, y: 4, r: 5 })
  test.same(new Circle([3, 4, 5]), { x: 3, y: 4, r: 5 })
  test.same(new Circle({}), { x: 0, y: 0, r: 1 })
  test.same(new Circle({ x: 3, y: 4, r: 5 }), { x: 3, y: 4, r: 5 })

  test.equal(Circle.isCircleParams(4), true)
  test.equal(Circle.isCircleParams([3, 4, 5]), true)
  test.equal(Circle.isCircleParams({}), true)
  test.equal(Circle.isCircleParams({ x: 'foo' }), false)
  test.equal(Circle.isCircleParams({ y: 'foo' }), false)
  test.equal(Circle.isCircleParams({ r: 'foo' }), false)
  test.equal(Circle.isCircleParams('foo'), false)

  const circle = new Circle(3, 4, 5)
  test.equal(Circle.ensure(circle), circle)
  test.same(Circle.ensure([3, 4, 5]), circle)
  test.same(Circle.ensureICircle([3, 4, 5]), circle)

  test.end()
})

tap.test('contains', test => {

  const circle = new Circle(3, 4, 5)
  test.equal(circle.containsPoint({ x: 2, y: 2 }), true)
  test.equal(circle.containsPoint({ x: 20, y: 2 }), false)

  test.same(circle.localPoint({ x: 4, y: 5 }), { x: 0.2, y: 0.2 })
  test.same(circle.localCircle({ x: 4, y: 5, r: 5 }), { x: 0.2, y: 0.2, r: 1 })

  test.end()
})

tap.test('intersections', test => {

  test.equal(Circle.intersectsCircleCircle([4, 0, 2], [14, 0, 1]), false)
  test.equal(Circle.intersectsCircleCircle([4, 0, 2], [14, 0, 8]), true)

  // 0 intersction
  test.same(Circle.intersectionCircleCircle([-10, 3, 1], [6, 23, 4]), [])

  // 1 intersction
  test.same(Circle.intersectionCircleCircle([-1, 0, 1], [1, 0, 1]), [{ x: 0, y: 0 }])

  // 2 intersections
  const A = new Circle(2, 2, Math.sqrt(2))
  const B = new Circle(5, 1, Math.sqrt(2) * 2)
  test.equal(A.intersectsCircle(B), true)
  test.same(A.intersectionCircle(B), [{ x: 3, y: 2.9999999999999996 }, { x: 2.2, y: 0.6000000000000001 }])


  test.equal(Circle.intersectionUnitCircleCircle(1, 3), null)
  test.same(Circle.intersectionUnitCircleCircle(1.5, 1.5), { u: 0.3333333333333333, v: 0.9428090415820634 })

  test.end()
})
