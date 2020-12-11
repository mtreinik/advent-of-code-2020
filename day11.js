#!/usr/bin/env node
const aoc = require('./aoc')

aoc.parseLine = (line) => line.split('')

function countSeats(lines) {
  return lines.flat().filter((seat) => seat === '#').length
}

function countSeatOccupied(lines, x, y) {
  if (y < 0 || y >= lines.length || x < 0 || x >= lines[0].length) {
    return 0
  }
  return lines[y][x] === '#' ? 1 : 0
}

function countAdjacentSeatsOccupied(lines, x, y) {
  return (
    countSeatOccupied(lines, x - 1, y - 1) +
    countSeatOccupied(lines, x, y - 1) +
    countSeatOccupied(lines, x + 1, y - 1) +
    countSeatOccupied(lines, x - 1, y) +
    countSeatOccupied(lines, x + 1, y) +
    countSeatOccupied(lines, x - 1, y + 1) +
    countSeatOccupied(lines, x, y + 1) +
    countSeatOccupied(lines, x + 1, y + 1)
  )
}

function moveSeats(lines) {
  let newLines = []
  for (let y = 0; y < lines.length; y++) {
    newLines[y] = []
    for (let x = 0; x < lines[y].length; x++) {
      const seatOccupied = countSeatOccupied(lines, x, y)
      const adjacentSeatsOccupied = countAdjacentSeatsOccupied(lines, x, y)
      if (lines[y][x] === '.') {
        newLines[y][x] = lines[y][x]
      } else if (seatOccupied && adjacentSeatsOccupied >= 4) {
        newLines[y][x] = 'L'
      } else if (!seatOccupied && adjacentSeatsOccupied === 0) {
        newLines[y][x] = '#'
      } else {
        newLines[y][x] = lines[y][x]
      }
    }
  }
  return newLines
}

function countOccupiedSeatsOnLine(line) {
  let counter = 0
  line.forEach((seat) => {
    if (seat === '#') {
      counter++
    }
  })
  return counter
}

function showSeats(lines) {
  lines.forEach((line) =>
    console.log(line.join(''), countOccupiedSeatsOnLine(line))
  )
  console.log('total seats:', countSeats(lines))
  console.log()
}

function isSame(oldLines, newLines) {
  for (let y = 0; y < newLines.length; y++) {
    for (let x = 0; x < newLines[y].length; x++) {
      if (oldLines[y][x] !== newLines[y][x]) {
        return false
      }
    }
  }
  return true
}

aoc.getResult1 = (lines) => {
  let oldLines = lines.map(() => [])
  while (!isSame(oldLines, lines)) {
    //showSeats(lines)
    const newLines = moveSeats(lines)
    oldLines = lines
    lines = newLines
  }
  return countSeats(lines)
}

function countFirstSeat(lines, startX, startY, dx, dy) {
  let x = startX + dx
  let y = startY + dy
  while (
    y >= 0 &&
    y < lines.length &&
    x >= 0 &&
    x < lines[0].length &&
    lines[y][x] === '.'
  ) {
    x += dx
    y += dy
  }
  if (y < 0 || y >= lines.length || x < 0 || x >= lines[0].length) {
    return 0
  }
  return lines[y][x] === '#' ? 1 : 0
}

function countFirstAdjacentSeatsOccupied(lines, x, y) {
  return (
    countFirstSeat(lines, x, y, -1, -1) +
    countFirstSeat(lines, x, y, 0, -1) +
    countFirstSeat(lines, x, y, 1, -1) +
    countFirstSeat(lines, x, y, -1, 0) +
    countFirstSeat(lines, x, y, 1, 0) +
    countFirstSeat(lines, x, y, -1, 1) +
    countFirstSeat(lines, x, y, 0, 1) +
    countFirstSeat(lines, x, y, 1, 1)
  )
}

function moveSeatsPart2(lines) {
  let newLines = []
  for (let y = 0; y < lines.length; y++) {
    newLines[y] = []
    for (let x = 0; x < lines[y].length; x++) {
      const seatOccupied = countSeatOccupied(lines, x, y)
      const adjacentSeatsOccupied = countFirstAdjacentSeatsOccupied(lines, x, y)
      if (lines[y][x] === '.') {
        newLines[y][x] = lines[y][x]
      } else if (seatOccupied && adjacentSeatsOccupied >= 5) {
        newLines[y][x] = 'L'
      } else if (!seatOccupied && adjacentSeatsOccupied === 0) {
        newLines[y][x] = '#'
      } else {
        newLines[y][x] = lines[y][x]
      }
    }
  }
  return newLines
}

aoc.getResult2 = (lines) => {
  let oldLines = lines.map(() => [])
  while (!isSame(oldLines, lines)) {
    // showSeats(lines)
    const newLines = moveSeatsPart2(lines)
    oldLines = lines
    lines = newLines
  }
  return countSeats(lines)
}

aoc.run()
