import { Point, Interval } from '../some-utils/geom/index.js'

const kebabCase = str => (str  
  .replace(/([A-Z])([A-Z])/g, '$1-$2')
  .replace(/([a-z])([A-Z])/g, '$1-$2')
  .replace(/[\s_]+/g, '-')            
  .toLowerCase()
)

const svg = document.querySelector('svg')
const info = {
  frame: 0,
  time: 0,
  pointer: new Point(),
  pointerIsDown: false,
}
const onFrameCallbacks = new Set()
const onFrameAdd = (cb) => {
  onFrameCallbacks.add(cb)
  return { destroy: () => onFrameCallbacks.delete(cb) }
}
const loop = () => {
  requestAnimationFrame(loop)
  for (const cb of onFrameCallbacks) {
    cb(info)
  }
  info.time += 1 / 60
  info.frame++
}
loop()

window.addEventListener('mousemove', event => {
  let { x, y } = event
  const r = svg.getBoundingClientRect()
  x += -r.x
  y += -r.y
  info.pointer.set(x, y)
})

window.addEventListener('pointerdown', () => {
  info.pointerIsDown = true
})

window.addEventListener('pointerup', () => {
  info.pointerIsDown = false
})

/**
 *
 * @param {SVGElement} element
 * @param {Record<string, any>} props
 */
const setAttributes = (element, {
  innerHTML = null,
  ...props
}) => {
  if (innerHTML && element.innerHTML !== innerHTML) element.innerHTML = innerHTML
  for (const [key, value] of Object.entries(props)) {
    element.setAttributeNS(null, kebabCase(key), value)
  }
}

export const create = (type, {
  parent = svg,
  ...props
} = {}) => {
  const element = document.createElementNS('http://www.w3.org/2000/svg', type)
  parent.append(element)
  setAttributes(element, props)
  return element
}

export const createLine = ({
  x = 0, x1 = x, x2 = x,
  y = 0, y1 = y, y2 = y,
  onFrame = null,
  ...props
} = {}) => {
  const line = create('line', { x1, y1, x2, y2, ...props })
  const instance = {
    update: props => setAttributes(line, props)
  }
  if (onFrame) {
    onFrameAdd(info => {
      onFrame(instance, info)
    })
  }
  return line
}

export const createInterval = ({
  interval,
  y = 0,
  color = 'black',
  strokeWidth = 1,
  onFrame = null,
} = {}) => {
  
  const innerInterval = Interval.ensure(interval)
  
  const parent = create('g', { fill: color })
  
  const line = createLine({
    x1: innerInterval.min,
    x2: innerInterval.max,
    y,
    stroke: color,
    strokeWidth,
    parent,
  })

  const renderText = (lines = []) => {
    if (typeof lines === 'string') lines = lines.split('\n')
    lines = lines.flat(Infinity)
    const { min, max } = innerInterval
    lines.unshift(`[${min}, ${max}]`)
    const texts = [...parent.querySelectorAll('text')]
    while (texts.length > lines.length) {
      texts.pop().remove()
    }
    while (texts.length < lines.length) {
      const text = create('text', { parent, textAnchor: 'middle' })
      texts.push(text)
    }
    for (const [index, line] of lines.entries()) {
      setAttributes(texts[index], {
        x: innerInterval.center,
        y: y + 11 + 11 * index,
        innerHTML: line,
      })
    }
  }

  renderText()

  const update = ({ 
    interval,
    color,
    text = null,
    ...props 
  }) => {
    if (color) {
      setAttributes(parent, { fill: color })
      setAttributes(line, { stroke: color })
    }
    if (interval) {
      innerInterval.set(interval)
      setAttributes(line, { x1: innerInterval.min, x2: innerInterval.max })
      for (const text of parent.querySelectorAll('text')) {
        setAttributes(text, { x: innerInterval.center })
      }
    }
    renderText(text ?? [])
    setAttributes(parent, props)
  }

  const instance = {
    interval: innerInterval,
    update,
  }

  if (onFrame) {
    onFrameAdd(info => {
      onFrame(instance, info)
    })
  }

  return instance
}
