let width = 300
let height = 300
let cellSize = 2
let mutation = 0
let grid, ctx, canvas

let stats = {
  generation: 0,
  alive: 0
}

function init () {
  // Prepare canvas
  canvas = document.createElement('canvas')
  canvas.width = width * cellSize + 1
  canvas.height = height * cellSize + 1
  document.getElementById('game').appendChild(canvas)
  ctx = canvas.getContext('2d')
  ctx.translate(0.5, 0.5)

  // Prepare grid
  stats.generation = 1
  grid = []
  for (let x = 0; x < width; x++) {
    grid[x] = []
    for (let y = 0; y < height; y++) {
      grid[x][y] = Math.random() > 0.6 ? 1 : 0
      stats.alive += grid[x][y] ? 1 : 0
    }
  }

  // Let's play
  play()
}

function draw () {
  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  // Gridlines
  ctx.lineWidth = 0.5
  ctx.strokeStyle = '#888'
  ctx.beginPath()
  for (let x = 0; x <= width * cellSize; x += cellSize) {
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height * cellSize)
  }
  for (let y = 0; y <= height * cellSize; y += cellSize) {
    ctx.moveTo(0, y)
    ctx.lineTo(width * cellSize, y)
  }
  ctx.stroke()

  // Draw cells
  ctx.fillStyle = '#000'
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (grid[x][y]) {
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
      }
    }
  }
}

function nextgen () {
  stats.generation++
  stats.alive = 0
  let nextGrid = []
  for (let x = 0; x < width; x++) {
    nextGrid[x] = []
    for (let y = 0; y < height; y++) {
      let mutate = Math.random() < mutation
      let alive = [
        grid[(width + x - 1) % width][(height + y - 1) % height],
        grid[(width + x) % width][(height + y - 1) % height],
        grid[(width + x + 1) % width][(height + y - 1) % height],

        grid[(width + x - 1) % width][(height + y) % height],
        grid[(width + x + 1) % width][(height + y) % height],

        grid[(width + x - 1) % width][(height + y + 1) % height],
        grid[(width + x) % width][(height + y + 1) % height],
        grid[(width + x + 1) % width][(height + y + 1) % height]
      ].reduce((prev, curr) => (curr ? 1 : 0) + prev, 0)
      nextGrid[x][y] = (grid[x][y] && (mutate || (alive === 2 || alive === 3))) || (!grid[x][y] && alive === 3) ? 1 : 0
      stats.alive += nextGrid[x][y] ? 1 : 0
    }
  }
  grid = nextGrid
}

function printStats () {
  let statsContainer = document.getElementById('stats')
  statsContainer.innerHTML = 
    `Generation: ${stats.generation}<br>` +
    `Alive: ${stats.alive} (${parseInt(stats.alive / (width * height) * 10000) / 100.00}%)`
}

function play () {
  draw()
  printStats()
  nextgen()
  setTimeout(play, 50)
}

// Helpers

function registerEvent (element, event, handler, capture) {
  if (/msie/i.test(navigator.userAgent)) {
    element.attachEvent('on' + event, handler)
  } else {
    element.addEventListener(event, handler, capture)
  }
}

registerEvent(window, 'load', () => init())
