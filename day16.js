#!/usr/bin/env node
const aoc = require('./aoc')

function isValidForRule(rule, number) {
  return (
    (rule.range1[0] <= number && number <= rule.range1[1]) ||
    (rule.range2[0] <= number && number <= rule.range2[1])
  )
}

function isValidForSomeRule(rules, number) {
  return rules.some((rule) => isValidForRule(rule, number))
}

aoc.getResult1 = (lines) => {
  let lineNum = 0
  const rules = []
  while (lines[lineNum] !== '') {
    const [fieldName, range1Str, , range2Str] = lines[lineNum++].split(' ')
    const range1 = range1Str.split('-').map((x) => parseInt(x, 10))
    const range2 = range2Str.split('-').map((x) => parseInt(x, 10))
    rules.push({
      fieldName,
      range1,
      range2,
    })
  }
  lineNum += 2

  // eslint-disable-next-line no-unused-vars
  const myTicket = lines[lineNum++]
  lineNum += 2

  const errors = []
  while (lineNum < lines.length) {
    const ticket = lines[lineNum++]
    const numbers = ticket.split(',').map((x) => parseInt(x, 10))
    numbers.forEach((number) => {
      if (!isValidForSomeRule(rules, number)) {
        errors.push(number)
      }
    })
  }

  return errors.reduce((sum, error) => sum + error, 0)
}

function getValidFieldsForPosition(rules, tickets, position) {
  const validRulesForPosition = rules.filter((rule) => {
    const isRuleOk = tickets.every((ticket) => {
      return isValidForRule(rule, ticket[position])
    })
    return isRuleOk
  })
  return validRulesForPosition.map((rule) => rule.fieldName)
}

function findFieldPositions(possiblePositions, positions) {
  if (possiblePositions.length === 0) {
    return positions
  }

  const position = possiblePositions.find(
    (possiblePosition) => possiblePosition.validFields.length === 1
  )
  const fieldName = position.validFields[0]

  const otherPossiblePositions = possiblePositions
    .filter(
      (possiblePosition) => possiblePosition.position !== position.position
    )
    .map((possiblePosition) => {
      const position = possiblePosition.position
      const validFields = possiblePosition.validFields.filter(
        (field) => field !== fieldName
      )
      return { position, validFields }
    })

  return findFieldPositions(otherPossiblePositions, positions.concat(position))
}

aoc.getResult2 = (lines) => {
  let lineNum = 0
  const rules = []
  while (lines[lineNum] !== '') {
    const [fieldName, ranges] = lines[lineNum++].split(':')
    const [range1Str, , range2Str] = ranges.trim().split(' ')
    const range1 = range1Str.split('-').map((x) => parseInt(x, 10))
    const range2 = range2Str.split('-').map((x) => parseInt(x, 10))
    rules.push({
      fieldName,
      range1,
      range2,
    })
  }
  lineNum += 2

  const myTicket = lines[lineNum++].split(',')
  lineNum += 2

  const validTickets = []
  while (lineNum < lines.length) {
    const ticket = lines[lineNum++]
    const numbers = ticket.split(',').map((x) => parseInt(x, 10))
    const isValidTicket = numbers.every((number) => {
      return isValidForSomeRule(rules, number)
    })
    if (isValidTicket) {
      validTickets.push(numbers)
    }
  }

  const possibleFieldPositions = rules.map((_, position) => {
    return {
      position,
      validFields: getValidFieldsForPosition(rules, validTickets, position),
    }
  })

  const fieldPositions = findFieldPositions(possibleFieldPositions, [])

  const departureFields = fieldPositions.filter((field) =>
    field.validFields[0].match(/^departure/)
  )

  const product = departureFields.reduce(
    (product, field) => product * myTicket[field.position],
    1
  )
  return product
}

aoc.run()
