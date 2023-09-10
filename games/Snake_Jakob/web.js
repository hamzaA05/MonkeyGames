const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

// Mutable state
let state = initialState()

// Position
const x = c => Math.round(c * canvas.width / state.cols)
const y = r => Math.round(r * canvas.height / state.rows)

// Game loop
const draw = () => 
{
  // zurücksetzten
  ctx.fillStyle = '#232323'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Snake
  ctx.fillStyle = 'rgb(0,200,50)'
  state.snake.map(p => ctx.fillRect(x(p.x), y(p.y), x(1), y(1)))

  // Apfel
  ctx.fillStyle = 'rgb(255,50,0)'
  ctx.fillRect(x(state.apple.x), y(state.apple.y), x(1), y(1))

  // Game Over
  if (state.snake.length == 0) 
  {
    ctx.fillStyle = 'rgb(255,0,0)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
}

// Game loop update
const step = t1 => t2 => 
{
  if (t2 - t1 > 100) 
  {
    state = next(state)
    draw()
    window.requestAnimationFrame(step(t2))
  } else 
  {
    window.requestAnimationFrame(step(t1))
  }
}

// Bewegungstasten
window.addEventListener('keydown', e => 
{
  switch (e.key) 
  {
    case 'w':  case 'ArrowUp':    state = enqueue(state, NORTH); break //oben
    case 'a':  case 'ArrowLeft':  state = enqueue(state, WEST);  break //links
    case 's':  case 'ArrowDown':  state = enqueue(state, SOUTH); break //unten
    case 'd':  case 'ArrowRight': state = enqueue(state, EAST);  break //rechts
  }
})

// Main
draw(); window.requestAnimationFrame(step(0))
