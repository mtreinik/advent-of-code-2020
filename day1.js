#!/usr/bin/env node
const rl = require('./rl')
const numbers = []

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

rl.on('line', (line) => numbers.push(parseInt(line, 10)))

rl.on('close', () => {
  // sort numbers in ascending order
  numbers.sort((a, b) => a - b)

  const result1 = findProductOfTwoNumbersWithSum(numbers, 2020)
  const result2 = numbers.reduce((result, number) =>
    findProductOfThreeNumbersWithSum(numbers, number, result, 2020)
  )

  console.log('part 1:', result1, 'part 2:', result2)
})
