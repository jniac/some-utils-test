import { Circle } from '../some-utils/geom/Circle.js'
import { Point } from '../some-utils/geom/Point.js'
import { create, svg } from '../common/svg.js'

Object.assign(window, { Circle, Point })

const createCircle = ({ x, y, r, color, name }) => {
  const circle = create('circle', { 
    cx: x, 
    cy: y, 
    r, 
    stroke: color, 
    fill: 'none',
  })
  const text = create('text', {
    x,
    y,
    fill: color,
    innerHTML: name,
  })
  const update = ({ x, y, r, color }) => {
    circle.update({ cx: x, cy: y, r, stroke: color })
    text.update({ x, y })
  }
  const instance = {
    update,
    get x() { return circle.props.cx },
    get y() { return circle.props.cy },
    get r() { return circle.props.r },
    get circle() { return Circle.ensure(instance)},
    get point() { return Point.ensure(instance) },
  }
  return instance
}

const c1 = createCircle({
  name: 'C1',
  x: 200,
  y: 200,
  r: 100,
  color: 'black',
})

const c2 = createCircle({
  name: 'C2',
  x: 260,
  y: 200,
  r: 120,
  color: 'red',
})

const temp = []

const update = () => {
  document.querySelector('footer p').innerHTML = Circle.circleCircleStatus(c1.circle, c2.circle)

  const intersectionPoints = Circle.circleCircleIntersection(c1.circle, c2.circle)
  const tangentPoints = Circle.circleTangentPoint(c1.circle, c2.circle)
  
  temp.forEach(i => i.destroy())
  temp.length = 0
  temp.push(...[...intersectionPoints, ...tangentPoints].map(p => {
    return create('circle', { cx: p.x, cy: p.y, r: 3 })
  }))
  temp.push(...tangentPoints.map(p => {
    return create('line', {
      x1: p.x, 
      y1: p.y,
      x2: c2.circle.x,
      y2: c2.circle.y,
      stroke: 'black',
    })
  }))
  temp.push(...c1.circle.tangentAnglePoint(c2.circle).map(p => {
    return create('line', {
      x1: c1.x,
      y1: c1.y,
      x2: c1.x + p.x * 20,
      y2: c1.y + p.y * 20,
      stroke: 'black',
    })
  }))
}

document.body.onpointermove = event => {
  const rect = svg.getBoundingClientRect()
  const x = event.x - rect.x
  const y = event.y - rect.y
  c2.update({ x, y })
  update()
}

document.body.onpointerdown = () => {
  c2.update({ r: c2.circle.r === 120 ? 50 : 120 })
  update()
}

Object.assign(window, { c1 })