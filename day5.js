#!/usr/bin/env node
const aoc = require('./aoc')

aoc.getResult1 = (lines) => {
  let maxId = 0
  lines.forEach((line) => {
    let lo = 0
    let hi = 127
    let left = 0
    let right = 7
    const chars = line.split('')
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i]
      const loHiFloor = Math.floor((lo + hi) / 2)
      const loHiCeil = Math.ceil((lo + hi) / 2)
      const leftRightFloor = Math.floor((left + right) / 2)
      const leftRightCeil = Math.ceil((left + right) / 2)
      switch (char) {
        case 'F':
          hi = loHiFloor
          break
        case 'B':
          lo = loHiCeil
          break
        case 'L':
          right = leftRightFloor
          break
        case 'R':
          left = leftRightCeil
      }
    }
    if (lo !== hi) {
      console.error('ERROR:', 'lo', lo, 'hi', hi)
    }
    if (left !== right) {
      console.error('ERROR:', 'left', left, 'right', right)
    }
    const id = lo * 8 + left
    if (id > maxId) {
      maxId = id
    }
  })
  return maxId
}

aoc.getResult2 = (lines) => {
  const seats = []
  lines.forEach((line) => {
    let lo = 0
    let hi = 127
    let left = 0
    let right = 7
    const chars = line.split('')
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i]
      const loHiFloor = Math.floor((lo + hi) / 2)
      const loHiCeil = Math.ceil((lo + hi) / 2)
      const leftRightFloor = Math.floor((left + right) / 2)
      const leftRightCeil = Math.ceil((left + right) / 2)
      switch (char) {
        case 'F':
          hi = loHiFloor
          break
        case 'B':
          lo = loHiCeil
          break
        case 'L':
          right = leftRightFloor
          break
        case 'R':
          left = leftRightCeil
      }
    }
    if (lo !== hi) {
      console.error('ERROR:', 'lo', lo, 'hi', hi)
    }
    if (left !== right) {
      console.error('ERROR:', 'left', left, 'right', right)
    }
    const id = lo * 8 + left
    if (!seats[lo]) {
      seats[lo] = []
    }
    seats[lo][left] = id
  })

  for (let row = 0; row < 128; row++) {
    let chars = ''
    if (seats[row]) {
      for (let column = 0; column < 8; column++) {
        if (seats[row][column]) {
          chars += '#'
        } else {
          chars += '.'
        }
      }
    }
    console.log(row, chars)
  }
}

aoc.run()
