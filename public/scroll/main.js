import { trackParallax } from '../common/parallax.js'
import { clamp } from '../some-utils/math/basic-functions.js'

const section = document.querySelector('section:nth-child(3)')
const lol = document.querySelector('#lol')

trackParallax(section, info => {
  const { x, y, width, height } = info

  const margin = 32
  const lolHeight = 200
  const top = - (window.innerHeight - lolHeight) / 2  + margin
  const bottom = (window.innerHeight - lolHeight) / 2  - margin
  const ty = clamp(-y * height, top, bottom)
  lol.style.transform = `translate(${-x * width}px, ${ty}px)`
})


// import '../common/cheat.js'
// import { Rectangle } from '../some-utils/geom/Rectangle.js'

// const element = document.querySelectorAll('section')[2]
// const lol = document.querySelector('#lol')

// const clamp01 = (x) => x < 0 ? 0 : x > 1 ? 1 : x
// const lerp = (a, b, t) => a + (b - a) * clamp01(t)
// const inverseLerp = (a, b, t) => clamp01((t - a) / (b - a))

// const update = () => {
//   const win = new Rectangle(0, 0, window.innerWidth, window.innerHeight) 
//   const el = new Rectangle(element.getBoundingClientRect())
//   const rx = inverseLerp(win.width, -el.width, el.x)
//   const ry = inverseLerp(win.height, -el.height, el.y)
//   const x = lerp(-1, 1, rx)
//   const y = lerp(-1, 1, ry)
//   const w = (win.width + el.width) / 2
//   const h = (win.height + el.height) / 2
//   lol.style.transform = `translate(${-x * w}px, ${-y * h}px)`
// }

// const loop = () => {
//   requestAnimationFrame(loop)
//   update()  
// }

// // requestAnimationFrame(loop)

// window.onpointermove = update
// window.onscroll = update