import { Interval } from '../some-utils/geom/index.js'
import { createInterval, createLine } from '../common/svg.js'
import '../common/cheat.js'

const i1 = createInterval({
  interval: new Interval(200, 340),
  y: 60,
})

createInterval({
  interval: [0, 100],
  y: 100,
  onFrame: ({ update }, { pointer, pointerIsDown }) => {
    const interval = new Interval({ center: pointer.x, length: pointerIsDown ? 180 : 100 })
    const sd = interval.signedDistance(i1.interval)
    const sd340 = interval.signedDistanceToValue(340)
    const sgd = interval.signedGreatestDistance(i1.interval)
    const ul = interval.uncoveredLength(i1.interval)
    const ur = interval.uncoveredRatio(i1.interval)
    update({
      color: 'red',
      interval,
      text: [
        `sd: ${sd}`, 
        `sd340: ${sd340}`, 
        `sgd: ${sgd}`,
        `ul: ${ul}`,
        `ur: ${ur.toFixed(2)}`,
      ],
    })
  },
})

