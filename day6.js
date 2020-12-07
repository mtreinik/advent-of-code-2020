#!/usr/bin/env node
const aoc = require('./aoc')

function parseGroups(lines) {
  const groups = []
  let group = []
  lines.forEach((line) => {
    if (line === '') {
      groups.push(group)
      group = []
    } else {
      group.push(line)
    }
  })
  if (group.length > 0) {
    groups.push(group)
  }
  return groups
}

aoc.preProcessLines = parseGroups

aoc.getResult1 = (groups) => {
  let result = 0
  groups.forEach((group) => {
    let uniqueAnswers = {}
    group.forEach((line) => {
      const chars = line.split('')
      chars.forEach((char) => (uniqueAnswers[char] = true))
    })
    const groupSum = Object.keys(uniqueAnswers).length
    result += groupSum
  })
  return result
}

aoc.getResult2 = (groups) => {
  let result = 0
  groups.forEach((group) => {
    let uniqueAnswers = []
    let haveAnswers = false
    group.forEach((line) => {
      const chars = line.split('')
      if (haveAnswers) {
        const charsInBoth = []
        chars.forEach((char) => {
          if (uniqueAnswers.includes(char)) {
            charsInBoth.push(char)
          }
        })
        uniqueAnswers = charsInBoth
      } else {
        uniqueAnswers = chars
        haveAnswers = true
      }
    })
    const groupSum = Object.keys(uniqueAnswers).length
    result += groupSum
  })
  return result
}

aoc.run()
