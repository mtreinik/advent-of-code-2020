#!/usr/bin/env node
const aoc = require('./aoc')

function getTokens(line) {
  let pos = 0
  const tokens = []
  while (pos < line.length) {
    if (line[pos] === 'n' || line[pos] === 's') {
      tokens.push(line[pos] + line[pos + 1])
      pos += 2
    } else {
      tokens.push(line[pos])
      pos++
    }
  }
  return tokens
}

function getPos(x, y) {
  return x + '|' + y
}

function getMap(lines) {
  const map = {}
  lines.forEach((line) => {
    let x = 0
    let y = 0
    const tokens = getTokens(line)
    tokens.forEach((token) => {
      switch (token) {
        case 'nw':
          y--
          break
        case 'ne':
          x++
          y--
          break
        case 'w':
          x--
          break
        case 'e':
          x++
          break
        case 'sw':
          x--
          y++
          break
        case 'se':
          y++
          break
      }
    })
    const pos = getPos(x, y)
    if (map[pos]) {
      map[pos] = 1 - map[pos]
    } else {
      // 0 = white
      // 1 = black
      map[pos] = 1
    }
  })
  return map
}

function countBlackTiles(map) {
  return Object.keys(map).filter((pos) => map[pos] === 1).length
}

aoc.getResult1 = (lines) => {
  const map = getMap(lines)
  return countBlackTiles(map)
}

function getNeighbor(map, x, y) {
  const pos = getPos(x, y)
  return (map[pos] === 1) ? 1 : 0
}

function getMinMax(map) {
  let minX = Number.MAX_SAFE_INTEGER
  let maxX = Number.MIN_SAFE_INTEGER
  let minY = Number.MAX_SAFE_INTEGER
  let maxY = Number.MIN_SAFE_INTEGER
  Object.keys(map).forEach((pos) => {
    const [x, y] = pos.split('|')
    minX = Math.min(minX, x)
    maxX = Math.max(maxX, x)
    minY = Math.min(minY, y)
    maxY = Math.max(maxY, y)
  })
  return { minX, maxX, minY, maxY }
}

function moveMap(map) {
  const newMap = {}
  const { minX, maxX, minY, maxY } = getMinMax(map)

  for (let y = minY - 1; y <= maxY + 1; y++) {
    for (let x = minX - 1; x <= maxX + 1; x++) {
      const pos = getPos(x, y)
      const tile = map[pos]
      const neighborCount =
        getNeighbor(map, x, y - 1) +
        getNeighbor(map, x + 1, y - 1) +
        getNeighbor(map, x - 1, y) +
        getNeighbor(map, x + 1, y) +
        getNeighbor(map, x - 1, y + 1) +
        getNeighbor(map, x, y + 1)
      if ((tile === 1 && neighborCount === 1) || neighborCount === 2) {
        newMap[pos] = 1
      }
    }
  }

  return newMap
}

// eslint-disable-next-line no-unused-vars
function showMap(map) {
  const { minX, maxX, minY, maxY } = getMinMax(map)
  for (let y = minY; y <= maxY; y++) {
    let row = ''
    for (let x = minX; x <= maxX; x++) {
      row += map[getPos(x, y)] === 1 ? 'B' : 'w'
    }
    console.log(row)
  }
  console.log('count', countBlackTiles(map))
  console.log()
}

aoc.getResult2 = (lines) => {
  let map = getMap(lines)
  // showMap(map)

  for (let i = 0; i < 100; i++) {
    map = moveMap(map)
    // showMap(map)
  }

  return countBlackTiles(map)
}

aoc.run()
