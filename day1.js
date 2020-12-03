#!/usr/bin/env node
const aoc = require('./aoc')

aoc.parseLine = (line) => parseInt(line, 10)

aoc.preProcessLines = (numbers) => {
  numbers.sort((a, b) => a - b)
  return numbers
}

function findProductOfTwoNumbersWithSum(numbers, sumToFind) {
  let first = 0
  let second = numbers.length - 1
  while (first < second) {
    const sum = numbers[first] + numbers[second]
    if (sum < sumToFind) {
      first++
    } else if (sum > sumToFind) {
      second--
    } else {
      return numbers[first] * numbers[second]
    }
  }
  return undefined
}

function findProductOfThreeNumbersWithSum(numbers, number, result, sumToFind) {
  const product = findProductOfTwoNumbersWithSum(numbers, sumToFind - number)
  if (product) {
    return number * product
  } else {
    return result
  }
}

aoc.getResult1 = (lines) => findProductOfTwoNumbersWithSum(lines, 2020)
aoc.getResult2 = (lines) =>
  lines.reduce((result, number) =>
    findProductOfThreeNumbersWithSum(lines, number, result, 2020)
  )

aoc.run()
