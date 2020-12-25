#!/usr/bin/env node
const aoc = require('./aoc')

function modPow(base, exponent, modulo) {
  let result = 1n
  base = base % modulo
  while (exponent > 0) {
    if (exponent % 2 === 1) {
      result = (result * base) % modulo
    }
    exponent = exponent >> 1
    base = (base * base) % modulo
  }
  return result
}

function findLoopSize(initialValue, expectedValue) {
  let loopSize = 0
  let transformedValue = 1n
  while (transformedValue !== expectedValue) {
    transformedValue = (transformedValue * initialValue) % 20201227n
    loopSize++
  }
  return loopSize
}

function transform(subject, loopSize) {
  return modPow(subject, loopSize, 20201227n)
}

aoc.parseLine = (line) => BigInt(line)

aoc.getResult1 = (lines) => {
  const [publicKey1, publicKey2] = lines
  const initialValue = 7n

  const loopSize1 = findLoopSize(initialValue, publicKey1)
  const loopSize2 = findLoopSize(initialValue, publicKey2)

  const key1 = transform(publicKey1, loopSize2)
  const key2 = transform(publicKey2, loopSize1)
  if (key1 !== key2) {
    console.log('ERROR: keys', key1, 'and', key2, 'do not match')
  }

  return Number(key1)
}

aoc.getResult2 = (lines) => {
  return undefined
}

aoc.run()
