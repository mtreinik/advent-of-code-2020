#!/usr/bin/env node
const aoc = require('./aoc')

function isBagFoundInside(bags, outerBag, bagToFind) {
  const innerBags = bags[outerBag]
  if (!innerBags || innerBags.length === 0) {
    return false
  }
  return innerBags.some(
    (innerBag) =>
      innerBag === bagToFind || isBagFoundInside(bags, innerBag, bagToFind)
  )
}

aoc.getResult1 = (lines) => {
  const bags = {}

  let result = 0
  lines.forEach((line) => {
    const [_, outerBag, contents] = /(.*) bags contain (.*)/.exec(line)
    if (contents !== 'no other bags.') {
      const innerBags = contents.split(', ')
      innerBags.forEach((innerBag) => {
        const color = /(\d+) (.*) bags?.?/.exec(innerBag)[2]
        if (!bags[outerBag]) {
          bags[outerBag] = []
        }
        bags[outerBag].push(color)
      })
    }
  })

  Object.keys(bags).forEach((outerBag) => {
    if (isBagFoundInside(bags, outerBag, 'shiny gold')) {
      result++
    }
  })
  return result
}

function getNumberOfInnerBags(bags, color) {
  const innerBags = bags[color]
  if (!innerBags || innerBags.length === 0) {
    return 0
  }
  let counter = 0
  for (let i = 0; i < innerBags.length; i++) {
    const { color: innerBagColor, num: factor } = innerBags[i]
    const numberOfInnerBags = getNumberOfInnerBags(bags, innerBagColor)
    counter += factor * (1 + numberOfInnerBags)
  }
  return counter
}

aoc.getResult2 = (lines) => {
  const bags = {}

  lines.forEach((line) => {
    const [_, outerBag, contents] = /(.*) bags contain (.*)/.exec(line)
    if (contents !== 'no other bags.') {
      const innerBags = contents.split(', ')
      innerBags.forEach((innerBag) => {
        const [_, num, color] = /(\d+) (.*) bags?.?/.exec(innerBag)
        if (!bags[outerBag]) {
          bags[outerBag] = []
        }
        bags[outerBag].push({ color, num })
      })
    }
  })

  return getNumberOfInnerBags(bags, 'shiny gold')
}

aoc.run()
