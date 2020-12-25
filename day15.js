#!/usr/bin/env node
const aoc = require('./aoc')

function getNumber(startingNumbers, lastTurn) {
  let turn = 1
  let spoken = 0
  const spokenAt = {}
  startingNumbers.forEach((startingNumber) => {
    spoken = startingNumber
    spokenAt[spoken] = { turn: turn, lastTurn: null }
    turn++
  })
  while (turn <= lastTurn) {
    spoken = spokenAt[spoken].lastTurn
      ? spokenAt[spoken].turn - spokenAt[spoken].lastTurn
      : 0
    const lastTurn = spokenAt[spoken] ? spokenAt[spoken].turn : null
    spokenAt[spoken] = { turn: turn, lastTurn: lastTurn }
    if (turn % 1000000 === 0) {
      console.log(
        'turn',
        turn,
        'spoken',
        spoken,
        'memory usage',
        Object.keys(spokenAt).length
      )
    }
    turn++
  }
  return spoken
}

aoc.getResult1 = (lines) => {
  return getNumber(lines[0].split(','), 2020)
}

aoc.getResult2 = (lines) => {
  return getNumber(lines[0].split(','), 30000000)
}

aoc.run()
