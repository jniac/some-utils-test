import tap from 'tap'
import { Circle } from '../../some-utils/geom/Circle'
import { almostSame } from '../tools/almostSame'

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



tap.test('contains, global / local', test => {

  const circle = new Circle(3, 4, 5)
  test.equal(circle.containsPoint({ x: 2, y: 2 }), true)
  test.equal(circle.containsPoint({ x: 20, y: 2 }), false)

  test.same(circle.localPoint({ x: 4, y: 5 }), { x: 0.2, y: 0.2 })
  test.same(circle.localCircle({ x: 4, y: 5, r: 5 }), { x: 0.2, y: 0.2, r: 1 })
  
  const p = circle.localPoint({ x: 1, y: 1 })
  test.same(circle.globalPoint(p), { x: 1, y: 1 })

  test.end()
})



tap.test('intersections', test => {

  test.equal(Circle.unitCircleCircleIntersection(1, 3), null)
  test.same(Circle.unitCircleCircleIntersection(1.5, 1.5), { u: 0.3333333333333333, v: 0.9428090415820634 })

  test.equal(Circle.circleCircleIntersects([4, 0, 2], [14, 0, 1]), false)
  test.equal(Circle.circleCircleIntersects([4, 0, 2], [14, 0, 8]), true)

  test.equal(Circle.circleCircleStatus([0, 0, 1], [9, 0, 1]), 'APART')
  test.equal(Circle.circleCircleStatus([0, 0, 2], [1, 0, 2]), 'TOUCHING')
  test.equal(Circle.circleCircleStatus([0, 0, 1], [0, 0, 2]), 'CIRCLE2_CONTAINS_CIRCLE1')
  test.equal(Circle.circleCircleStatus([0, 0, 2], [0, 0, 1]), 'CIRCLE1_CONTAINS_CIRCLE2')

  test.equal(Circle.circleCircleIntersects([0, 0, 1], [9, 0, 1]), false)
  test.equal(Circle.circleCircleIntersects([0, 0, 2], [1, 0, 2]), true)
  test.equal(Circle.circleCircleIntersects([0, 0, 1], [0, 0, 2]), false)
  test.equal(Circle.circleCircleIntersects([0, 0, 2], [0, 0, 1]), false)
  
  // 0 intersction
  test.same(Circle.circleCircleIntersection([-10, 3, 1], [6, 23, 4]), [])
  test.same(Circle.circleCircleIntersection([0, 0, 1], [0, 0, 2]), [])
  test.same(Circle.circleCircleIntersection([0, 0, 2], [0, 0, 1]), [])

  // 1 intersction
  test.same(Circle.circleCircleIntersection([-1, 0, 1], [1, 0, 1]), [{ x: 0, y: 0 }])

  // 2 intersections
  const A = new Circle(2, 2, Math.sqrt(2))
  const B = new Circle(5, 1, Math.sqrt(2) * 2)
  test.equal(A.circleIntersects(B), true)
  test.same(A.circleIntersection(B), [{ x: 3, y: 2.9999999999999996 }, { x: 2.2, y: 0.6000000000000001 }])

  test.end()
})



tap.test('tangent', test => {

  // Pure unit circle test:
  test.same(Circle.unitCircleTangentX(.5), null)
  test.same(Circle.unitCircleTangentX(1), { u: 1, v: 0 })
  test.same(Circle.unitCircleTangentX(2), { u: .5, v: 0.8660254037844386 })

  test.same(Circle.unitCircleTangentPoint({ x: 0, y: 0 }), [])
  test.same(Circle.unitCircleTangentPoint({ x: 1, y: 0 }), [{ x: 1, y: 0 }])
  test.equal(almostSame(Circle.unitCircleTangentPoint({ x: 1, y: 1}), [
    { x: 0, y: 1 },
    { x: 1, y: 0 },
  ]), 'ok')


  
  // Circle relatives:
  const A = new Circle(0, 0, 2)
  test.same(A.tangentPoint([0, 0]), [])
  test.same(A.tangentPoint([2, 0]), [{ x: 2, y: 0 }])
  test.same(A.tangentPoint([4, 0]), [{ x: 1, y: 1.7320508075688772 }, { x: 1, y: -1.7320508075688772 }])
  test.equal(almostSame(A.tangentAnglePoint({ x: 2, y: 2 }), [
    { x: 0, y: 1 },
    { x: 1, y: 0 },
  ]), 'ok')

  test.same(Circle.circleTangentPoint(1, [0, 0]), [])
  
  test.end()
})
