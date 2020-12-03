#!/usr/bin/env node
const aoc = require('./aoc')

function getTrees(lines, right, down) {
  let result = 0
  let x = 0
  let y = 0
  lines.forEach((line) => {
    if (y % down === 0) {
      const charAt = line[x % line.length]
      if (charAt === '#') {
        result++
      }
      x += right
    }
    y++
  })
  return result
}

aoc.getResult1 = (lines) => {
  return getTrees(lines, 3, 1)
}

aoc.getResult2 = (lines) => {
  return (
    getTrees(lines, 1, 1) *
    getTrees(lines, 3, 1) *
    getTrees(lines, 5, 1) *
    getTrees(lines, 7, 1) *
    getTrees(lines, 1, 2)
  )
}

aoc.run()
