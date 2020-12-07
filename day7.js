#!/usr/bin/env node
const aoc = require('./aoc')

function isContaining(bags, containingBag, bagWeAreLookingFor) {
  const containedBags = bags[containingBag]
  if (!containedBags || containedBags.length === 0) {
    return false
  }
  return containedBags.some(
    (containedBag) =>
      containedBag === bagWeAreLookingFor ||
      isContaining(bags, containedBag, bagWeAreLookingFor)
  )
}

function getNumberOfContainedBags(bags, numbers, color) {
  const containedBags = bags[color]
  const containedBagsNumbers = numbers[color]
  if (!containedBags || containedBags.length === 0) {
    return 0
  }
  let counter = 0
  for (let i = 0; i < containedBags.length; i++) {
    const containedBag = containedBags[i]
    const factor = containedBagsNumbers[i]
    const numContained = getNumberOfContainedBags(bags, numbers, containedBag)
    const numToAdd = factor * (1 + numContained)
    counter += numToAdd
  }
  return counter
}

aoc.getResult1 = (lines) => {
  const bags = {}

  let result = 0
  lines.forEach((line) => {
    const containingBag = line.replace(/ contain .*/, '').replace(/ bags/, '')
    const contents = line.replace(/.* contain /, '')
    if (contents !== 'no other bags.') {
      const containedBags = contents.split(', ')
      containedBags.forEach((containedBag) => {
        const num = containedBag.replace(/ .*/, '')
        const color = containedBag.replace(/\d+ /, '').replace(/ bags?.?/, '')
        if (!bags[containingBag]) {
          bags[containingBag] = []
        }
        bags[containingBag].push(color)
      })
    }
  })

  Object.keys(bags).forEach((containingBag) => {
    if (isContaining(bags, containingBag, 'shiny gold')) {
      result++
    }
  })
  return result
}

aoc.getResult2 = (lines) => {
  const bags = {}
  const numbers = {}

  lines.forEach((line) => {
    const containingBag = line.replace(/ contain .*/, '').replace(/ bags/, '')
    const contents = line.replace(/.* contain /, '')
    if (contents !== 'no other bags.') {
      const containedBags = contents.split(', ')
      containedBags.forEach((containedBag) => {
        const num = containedBag.replace(/ .*/, '')
        const color = containedBag.replace(/\d+ /, '').replace(/ bags?.?/, '')
        if (!bags[containingBag]) {
          bags[containingBag] = []
        }
        if (!numbers[containingBag]) {
          numbers[containingBag] = []
        }
        bags[containingBag].push(color)
        numbers[containingBag].push(num)
      })
    }
  })

  const result = getNumberOfContainedBags(bags, numbers, 'shiny gold')
  return result
}

aoc.run()
