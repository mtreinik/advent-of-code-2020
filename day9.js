#!/usr/bin/env node
const aoc = require('./aoc')

aoc.parseLine = (line) => parseInt(line, 10)

function isValid(numbers, pos, preambleLength) {
  let first = pos - preambleLength - 1
  let last = pos - 1
  const sumToFind = numbers[pos]
  for (let i = first; i <= last; i++) {
    for (let j = first; j <= last; j++) {
      if (i !== j && numbers[i] + numbers[j] === sumToFind) {
        return true
      }
    }
  }
  return false
}

aoc.getResult1 = (numbers) => {
  const preambleLength = 25

  let pos = preambleLength + 1
  while (isValid(numbers, pos, preambleLength)) {
    pos++
  }
  return numbers[pos]
}

aoc.getResult2 = (numbers) => {
  const sumToFind = 14360655

  for (let first = 0; first < numbers.length; first++) {
    for (let last = first + 1; last < numbers.length; last++) {
      let min = Number.MAX_SAFE_INTEGER
      let max = 0
      let sum = 0
      for (let i = first; i <= last && sum < sumToFind; i++) {
        sum += numbers[i]
        min = Math.min(min, numbers[i])
        max = Math.max(max, numbers[i])
      }
      if (sum === sumToFind) {
        return min + max
      }
    }
  }
  return 'failed'
}

aoc.run()
