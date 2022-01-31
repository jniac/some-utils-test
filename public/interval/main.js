import { Interval } from '../some-utils/geom/index.js'
import { create, createInterval } from '../common/svg.js'
import '../common/cheat.js'

const i1 = createInterval({
  interval: new Interval(200, 340),
  y: 60,
  onFrame: ({ update }) => {  
    const active = i1.interval.contains(pointer.interval)
    const strokeWidth = active ? 3 : 1
    const color = active ? 'red' : 'black'
    const fill = active ? '#f001' : '#0001'
    update({ color, strokeWidth })
    r1.update({ fill })
  },
})

const r1 = create('rect', {
  x: i1.interval.min,
  width: i1.interval.length,
  height: 800,
  fill: '#0001',
})

const pointer = createInterval({
  interval: [0, 100],
  y: 100,
  onFrame: ({ update }, { pointer, pointerIsDown }) => {
    const interval = new Interval({ center: pointer.x, length: pointerIsDown ? 180 : 100 })
    const sd = interval.signedDistance(i1.interval)
    const sd340 = interval.signedDistanceToValue(340)
    const sgd = interval.signedGreatestDistance(i1.interval)
    const cl = interval.coverLength(i1.interval)
    const cr = interval.coverRatio(i1.interval)
    update({
      color: 'red',
      interval,
      text: [
        `sd: ${sd}`, 
        `sd340: ${sd340}`, 
        `sgd: ${sgd}`,
        `cl: ${cl}`,
        `cr: ${cr.toFixed(2)}`,
      ],
    })
  },
})

