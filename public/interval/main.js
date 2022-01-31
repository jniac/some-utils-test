import { Interval } from '../some-utils/geom/index.js'
import { createInterval } from '../common/svg.js'
import '../common/cheat.js'

const i1 = createInterval({
  interval: new Interval(200, 340),
  y: 60,
  onFrame: ({ update }) => {
    const strokeWidth = i1.interval.contains(pointer.interval) ? 3 : 1
    update({ strokeWidth })
  },
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

