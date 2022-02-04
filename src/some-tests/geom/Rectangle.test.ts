import tap from 'tap'
import { Rectangle } from '../../some-utils/geom/Rectangle'

tap.test('constructor, set', test => {

  test.same(new Rectangle(), { x: 0, y: 0, width: 1, height: 1 })
  test.same(new Rectangle({}), { x: 0, y: 0, width: 1, height: 1 })
  test.same(new Rectangle(1, 2, 3, 4), { x: 1, y: 2, width: 3, height: 4 })
  test.same(new Rectangle(1, 2, 3, 4, 'collapse'), { x: 1, y: 2, width: 3, height: 4 })
  test.same(new Rectangle(12, 13), { x: 0, y: 0, width: 12, height: 13 })
  test.same(new Rectangle({ xMin: 1, yMin: 2, xMax: 4, yMax: 6 }), { x: 1, y: 2, width: 3, height: 4 })
  
  test.same(new Rectangle({ x: 1000 }), { x: 1000, y: 0, width: 1, height: 1 })

  // @ts-ignore
  test.throws(() => new Rectangle().set([1, 2, 3]))
  
  test.end()
})

tap.test('ensure', test => {

  // ensure returns the reference if instanceof Rectangle
  const r = new Rectangle(1, 2, 3, 4)
  test.equal(Rectangle.ensure(r), r)
  
  test.same(Rectangle.ensure([2, 2]), { x: 0, y: 0, width: 2, height: 2 })

  test.end()
})

tap.test('equals, copy, clone, setDimensions', test => {

  const r = new Rectangle(1, 2, 3, 4)
  test.equal(r.equals(r), true)
  test.equal(r.equals(new Rectangle(1, 2, 3, 4)), true)

  test.same(new Rectangle().copy(r), r)
  test.same(r.clone(), r)

  test.same(new Rectangle().setDimensions(1, 2, 3, 4), r)

  test.end()
})

tap.test('RectangleDegenerateMode', test => {

  // collapse is the default mode
  test.same(new Rectangle({ xMin: 10 }), { x: 5.5, y: 0, width: 0, height: 1 })
  test.same(new Rectangle({ yMin: 10 }), { x: 0, y: 5.5, width: 1, height: 0 })
  test.same(new Rectangle(-4, -4, 'collapse'), new Rectangle(-2, -2, 0, 0))

  test.same(new Rectangle({ xMin: 10 }, 'swap'), { x: 1, y: 0, width: 9, height: 1 })
  test.same(new Rectangle({ yMin: 10 }, 'swap'), { x: 0, y: 1, width: 1, height: 9 })

  test.same(new Rectangle(-3, -4, 'ignore'), { x: 0, y: 0, width: -3, height: -4 })
  
  test.end()
})

tap.test('getter / setter', test => {
  
  const r = new Rectangle()

  // width & height == 1
  test.equal(r.width, 1)
  test.equal(r.height, 1)

  test.equal(r.centerX, 0.5)
  test.equal(r.centerY, 0.5)

  test.equal(r.xMin, 0)
  test.equal(r.xMin = 2, 2)
  test.equal(r.yMin, 0)
  test.equal(r.yMin = 3, 3)

  // width & height == 0 (because "x-or-y-min" was bigger than "max")
  test.equal(r.width, 0)
  test.equal(r.height, 0)
  
  // moving "max" change width / height
  test.equal(r.xMax = 10, 10)
  test.equal(r.width, 8)
  test.equal(r.yMax = 15, 15)
  test.equal(r.height, 12)

  test.equal(r.xMin = 6, 6)
  test.equal(r.width, 4)
  test.equal(r.yMin = 5, 5)
  test.equal(r.height, 10)

  // width & height == 0 (because "x-or-y-max" was smaller than "min")
  test.equal(r.xMax = -10, -10)
  test.equal(r.width, 0)
  test.equal(r.yMax = -15, -15)
  test.equal(r.height, 0)

  test.end()
})

tap.test('union, intersection, signedDistance', test => {

  test.same(new Rectangle().union(new Rectangle(3, 4, 1, 1)), new Rectangle(4, 5))
  test.same(new Rectangle(-3, -4, 0, 0).union(new Rectangle(3, 4, 1, 1)), new Rectangle(-3, -4, 7, 9))

  const intersection = new Rectangle(1, 1, 2, 2).intersection(new Rectangle(2, 2, 4, 4))
  test.same(intersection, { x: 2, y: 2, width: 1, height: 1 })

  test.same(new Rectangle().signedDistance(new Rectangle(4, 3, 0, 0)), { x: 3, y: 2 })
  test.same(new Rectangle().signedDistance(new Rectangle(-4, -3, 1, 2)), { x: -3, y: -1 })
  test.same(new Rectangle(2, 2).signedDistance(new Rectangle(1, 1, 2, 2)), { x:0, y: 0 })

  test.same(new Rectangle().signedGreatestDistance(new Rectangle(4, 3, 0, 0)), { x: 4, y: 3 })
  test.same(new Rectangle().signedGreatestDistance(new Rectangle(-4, -3, 1, 2)), { x: -4, y: -2 })
  test.same(new Rectangle(1, 1, 2, 2).signedGreatestDistance(new Rectangle(4, 4)), { x: 0, y: 0 })
  
  test.end()
})

tap.test('misc', test => {

  test.equal(new Rectangle(3, 4).area(), 12)

  test.same(new Rectangle(-1, -1, 4, 4).topLeft(), { x: -1, y: -1 })
  test.same(new Rectangle(-1, -1, 4, 4).topRight(), { x: 3, y: -1 })
  test.same(new Rectangle(-1, -1, 4, 4).bottomRight(), { x: 3, y: 3 })
  test.same(new Rectangle(-1, -1, 4, 4).bottomLeft(), { x: -1, y: 3 })
  test.same(new Rectangle(-1, -1, 4, 4).center(), { x: 1, y: 1 })
  test.same(new Rectangle(-1, -1, 4, 4).relativePoint({ x: .75, y: .75 }), { x: 2, y: 2 })

  test.same(new Rectangle({ xMin: 1, yMin: 2, xMax: 4, yMax: 6 }).closestPoint({ x: 0, y: 0 }), { x: 1, y: 2 })
  test.same(new Rectangle({ xMin: 1, yMin: 2, xMax: 4, yMax: 6 }).closestPoint({ x: 10, y: 10 }), { x: 4, y: 6 })
  test.same(new Rectangle(3, 4).closestPoint({ x: 1, y: 2 }), { x: 1, y: 2 })

  test.same(new Rectangle({ xMin: 1, yMin: 2, xMax: 4, yMax: 6 }).contains(new Rectangle(2, 2, 1, 1)), true)
  test.same(new Rectangle({ xMin: 1, yMin: 2, xMax: 4, yMax: 6 }).contains(new Rectangle(0, 2, 1, 1)), false)
  test.same(new Rectangle({ xMin: 1, yMin: 2, xMax: 4, yMax: 6 }).containsPoint({ x: 3, y: 3 }), true)
  test.same(new Rectangle({ xMin: 1, yMin: 2, xMax: 4, yMax: 6 }).containsPoint({ x: -3, y: 3 }), false)

  test.same(new Rectangle().inflate(1), new Rectangle(-1, -1, 3, 3))
  test.same(new Rectangle().inflate({ top: 1, right: 2, bottom: 3, left: 4 }), new Rectangle(-4, -1, 7, 5))

  test.equal(new Rectangle().toString(), 'Rectangle{ x: 0, y: 0, width: 1, height:1 }')

  test.end()
})
