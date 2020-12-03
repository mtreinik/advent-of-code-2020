#!/usr/bin/env node
const aoc = require('./aoc')

aoc.getResult1 = (lines) => {
  let valid = 0
  lines.forEach((line) => {
    const [limits, charToFind, characters] = line.split(' ')
    const [lo, hi] = limits.split('-')
    const len = characters.split(charToFind[0]).length - 1
    if (lo <= len && len <= hi) {
      valid++
    }
  })
  return valid
}

aoc.getResult2 = (lines) => {
  let valid = 0
  lines.forEach((line) => {
    const [limits, charToFindAndColon, characters] = line.split(' ')
    const charToFind = charToFindAndColon[0]
    const [lo, hi] = limits.split('-')
    let count = 0
    if (characters[lo - 1] === charToFind) {
      count++
    }
    if (characters[hi - 1] === charToFind) {
      count++
    }
    if (count === 1) {
      valid++
    }
  })
  return valid
}

aoc.run()
