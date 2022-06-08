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
  return {
    update,
    get circle() {
      const { cx, cy, r } = circle.props
      return new Circle(cx, cy, r)
    }
  }
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

const intersections = []

const update = () => {
  document.querySelector('footer p').innerHTML = Circle.circleCircleStatus(c1.circle, c2.circle)
  intersections.forEach(i => i.destroy())
  intersections.length = 0
  const I = Circle.circleCircleIntersection(c1.circle, c2.circle)
  intersections.push(...I.map(i => {
    return create('circle', {
      cx: i.x,
      cy: i.y,
      r: 3,
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