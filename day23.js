#!/usr/bin/env node
const aoc = require('./aoc')

function pickThree(cups, position) {
  const picked = []

  picked.push(cups[position % cups.length])
  picked.push(cups[(position + 1) % cups.length])
  picked.push(cups[(position + 2) % cups.length])

  const cupsWithoutPicked = cups.filter((cup) => !picked.includes(cup))

  return { picked, cupsWithoutPicked }
}

function findDestinationPos(cups, min, max, destination) {
  while (cups.indexOf(destination) < 0) {
    destination--
    if (destination < min) {
      destination = max
    }
  }
  const destinationPos = cups.indexOf(destination)
  return destinationPos
}

function placeCups(cups, picked, destinationPos) {
  cups.splice(destinationPos + 1, 0, ...picked)
  return cups
}

function getMinAndMax(cups) {
  let min = Number.MAX_SAFE_INTEGER
  let max = Number.MIN_SAFE_INTEGER
  cups.forEach((cup) => {
    min = Math.min(min, cup)
    max = Math.max(max, cup)
  })
  return { min, max }
}

aoc.getResult1 = (lines) => {
  let cups = lines[0].split('').map((cup) => parseInt(cup, 10))
  const { min, max } = getMinAndMax(cups)

  const MAX_TURNS = 100
  let turns = MAX_TURNS
  let currentPos = 0
  while (turns--) {
    const { picked, cupsWithoutPicked } = pickThree(cups, currentPos + 1)
    const current = cups[currentPos]
    const destinationPos = findDestinationPos(
      cupsWithoutPicked,
      min,
      max,
      current - 1
    )
    cups = placeCups(cupsWithoutPicked, picked, destinationPos)

    const newCurrentPos = cups.indexOf(current)
    currentPos = (newCurrentPos + 1) % cups.length
  }

  let cup1Pos = cups.indexOf(1)
  cups.splice(cup1Pos % cups.length, 1)

  let result = ''
  for (let i = 0; i < cups.length; i++) {
    result += cups[cup1Pos]
    cup1Pos = (cup1Pos + 1) % cups.length
  }

  return result
}

// eslint-disable-next-line no-unused-vars
function showCups(cups, nextPos, maxCupsToShow) {
  let pos = 0
  const row = []
  for (let i = 0; i < maxCupsToShow && i < cups.length; i++) {
    row.push(cups[pos])
    pos = nextPos[pos]
  }
  console.log('cups:', row.join(' '))
}

function getPositionOfCup(cups, cup) {
  if (cup < 10) {
    return cups.indexOf(cup)
  } else {
    return cup - 1
  }
}

aoc.getResult2 = (lines) => {
  const cups = lines[0].split('').map((cup) => parseInt(cup, 10))
  for (let i = cups.length + 1; i <= 1000000; i++) {
    cups.push(i)
  }
  const { min, max } = getMinAndMax(cups)

  const nextPos = []
  for (let i = 0; i < cups.length; i++) {
    nextPos[i] = (i + 1) % cups.length
  }

  const MAX_TURNS = 10000000
  let turns = MAX_TURNS
  let currentPos = 0
  while (turns--) {
    const current = cups[currentPos]

    // pick three

    const pickedPos = nextPos[currentPos]
    const secondPickedPos = nextPos[pickedPos]
    const thirdPickedPos = nextPos[secondPickedPos]
    const afterPickedPos = nextPos[thirdPickedPos]

    const picked = []
    picked.push(cups[pickedPos])
    picked.push(cups[secondPickedPos])
    picked.push(cups[thirdPickedPos])

    // select destination cup

    let destination = current - 1
    if (destination < min) {
      destination = max
    }
    while (picked.includes(destination)) {
      destination--
      if (destination < min) {
        destination = max
      }
    }

    const destinationPos = getPositionOfCup(cups, destination)
    const afterDestinationPos = nextPos[destinationPos]

    // place cups

    nextPos[currentPos] = afterPickedPos
    nextPos[destinationPos] = pickedPos
    nextPos[thirdPickedPos] = afterDestinationPos

    const newCurrentPos = getPositionOfCup(cups, current)
    currentPos = nextPos[newCurrentPos]
  }
  // showCups(cups, nextPos, 15)

  const cup1Pos = cups.indexOf(1)
  const nextCupPos = nextPos[cup1Pos]
  const nextCup = cups[nextCupPos]
  const cupAfterThatPos = nextPos[nextCupPos]
  const cupAfterThat = cups[cupAfterThatPos]
  return nextCup * cupAfterThat
}

aoc.run()
