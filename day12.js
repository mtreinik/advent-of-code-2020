#!/usr/bin/env node
const aoc = require('./aoc')

aoc.parseLine = (line) => {
  return { action: line[0], value: parseInt(line.slice(1), 10) }
}

aoc.getResult1 = (lines) => {
  let x = 0
  let y = 0
  let dx = 1
  let dy = 0
  lines.forEach((line) => {
    let { action, value } = line
    switch (action) {
      case 'N':
        y += value
        break
      case 'S':
        y -= value
        break
      case 'E':
        x += value
        break
      case 'W':
        x -= value
        break
      case 'L':
        while (value) {
          const tmp = dx
          dx = -dy
          dy = tmp
          value -= 90
        }
        break
      case 'R':
        while (value) {
          const tmp = dx
          dx = dy
          dy = -tmp
          value -= 90
        }
        break
      case 'F':
        x += dx * value
        y += dy * value
        break
    }
  })
  return Math.abs(x) + Math.abs(y)
}

aoc.getResult2 = (lines) => {
  let x = 0
  let y = 0
  let dx = 10
  let dy = 1
  lines.forEach((line) => {
    let { action, value } = line
    switch (action) {
      case 'N':
        dy += value
        break
      case 'S':
        dy -= value
        break
      case 'E':
        dx += value
        break
      case 'W':
        dx -= value
        break
      case 'L':
        while (value) {
          const tmp = dx
          dx = -dy
          dy = tmp
          value -= 90
        }
        break
      case 'R':
        while (value) {
          const tmp = dx
          dx = dy
          dy = -tmp
          value -= 90
        }
        break
      case 'F':
        x += dx * value
        y += dy * value
        break
    }
  })
  return Math.abs(x) + Math.abs(y)
}

aoc.run()
