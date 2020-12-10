#!/usr/bin/env node
const aoc = require('./aoc')

aoc.parseLine = (line) => parseInt(line, 10)

aoc.preProcessLines = (numbers) => {
  numbers.sort((a, b) => a - b)
  return numbers
}

function getNextAdapter(adapters, joltage) {
  let min = Number.MAX_SAFE_INTEGER
  adapters.forEach((adapter) => {
    const isValid = adapter >= joltage + 1 && adapter <= joltage + 3
    if (isValid) {
      min = Math.min(adapter, min)
    }
  })
  return min
}

function getDiffs(adapters, joltage, diffsOf1, diffsOf3) {
  if (adapters.length === 0) {
    return [diffsOf1, diffsOf3 + 1]
  } else {
    const nextAdapter = getNextAdapter(adapters, joltage)
    const restOfAdapters = adapters.filter((a) => a !== nextAdapter)
    if (nextAdapter === joltage + 1) {
      return getDiffs(restOfAdapters, joltage + 1, diffsOf1 + 1, diffsOf3)
    } else if (nextAdapter === joltage + 2) {
      return getDiffs(restOfAdapters, joltage + 2, diffsOf1, diffsOf3)
    } else if (nextAdapter === joltage + 3) {
      return getDiffs(restOfAdapters, joltage + 3, diffsOf1, diffsOf3 + 1)
    }
    return null
  }
}

aoc.getResult1 = (lines) => {
  const [differencesOf1, differencesOf3] = getDiffs(lines, 0, 0, 0)
  return differencesOf1 * differencesOf3
}

function getPossibleAdapters(adapters, joltage) {
  return adapters.filter((adapter) => {
    return adapter >= joltage + 1 && adapter <= joltage + 3
  })
}

function getNumberOfCombinations(adapters, joltage, targetJoltage) {
  if (joltage + 3 === targetJoltage) {
    return 1
  } else if (adapters.length === 0) {
    return 0
  } else {
    let numberOfCombinations = 0
    const possibleAdapters = getPossibleAdapters(adapters, joltage)
    possibleAdapters.forEach((adapter) => {
      if (memo[adapter]) {
        numberOfCombinations += memo[adapter]
      } else {
        const restOfAdapters = adapters.filter((a) => a !== adapter)
        const numberOfCombinationsWithRestOfAdapters = getNumberOfCombinations(
          restOfAdapters,
          adapter,
          targetJoltage
        )
        memo[adapter] = numberOfCombinationsWithRestOfAdapters
        numberOfCombinations += numberOfCombinationsWithRestOfAdapters
      }
    })
    return numberOfCombinations
  }
}

const memo = []

aoc.getResult2 = (adapters) => {
  let maxAdapter = 0
  adapters.forEach((line) => (maxAdapter = Math.max(maxAdapter, line)))
  return getNumberOfCombinations(adapters, 0, maxAdapter + 3)
}

aoc.run()
