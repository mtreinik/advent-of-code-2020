#!/usr/bin/env node
const aoc = require('./aoc')

aoc.getResult1 = (lines) => {
  const earliestTime = parseInt(lines[0], 10)
  const buses = lines[1]
    .split(',')
    .filter((id) => id !== 'x')
    .map((id) => parseInt(id, 10))

  let resultTime = Number.MAX_SAFE_INTEGER
  let resultBus = 0
  buses.forEach((bus) => {
    const time = Math.floor(earliestTime / bus + 1) * bus
    if (time < resultTime) {
      resultTime = time
      resultBus = bus
    }
  })

  return resultBus * (resultTime - earliestTime)
}

function crt(buses, divisor, remainder) {
  if (buses.length === 0) {
    return remainder
  }
  const { divisor: secondDivisor, remainder: secondRemainder } = buses.pop()
  let num = remainder
  while (num % secondDivisor !== secondRemainder) {
    num += divisor
  }
  return crt(buses, divisor * secondDivisor, num)
}

aoc.getResult2 = (lines) => {
  const buses = lines[1]
    .split(',')
    .map((id, index) => {
      if (id === 'x') {
        return null
      } else {
        const divisor = parseInt(id, 10)
        let remainder = (divisor - index) % divisor
        while (remainder < 0) {
          remainder += divisor
        }
        return { divisor, remainder }
      }
    })
    .filter((entry) => entry)

  const { divisor, remainder } = buses.pop()
  return crt(buses, divisor, remainder)
}

aoc.run()
