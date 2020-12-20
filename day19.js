#!/usr/bin/env node
const aoc = require('./aoc')

const LITERAL = 'literal'
const SUBRULES = 'subrules'

function combine(firstMessages, restMessages) {
  return firstMessages
    .map((firstMessage) =>
      restMessages.map((restMessage) => firstMessage + restMessage)
    )
    .flat()
}

function generateValidMessages(rules, rule) {
  if (rule.type === LITERAL) {
    return [rule.matches]
  } else if (rule.type === SUBRULES) {
    if (rule.matches.length === 1) {
      const firstMatch = rule.matches[0]
      if (firstMatch.length === 1) {
        const subRule = rules[firstMatch[0]]
        const messages = generateValidMessages(rules, subRule)
        return messages
      } else {
        const firstSubRule = { ...rule, matches: [firstMatch.slice(0, 1)] }
        const restSubRules = { ...rule, matches: [firstMatch.slice(1)] }
        const firstMessages = generateValidMessages(rules, firstSubRule)
        const restMessages = generateValidMessages(rules, restSubRules)
        const combinedMessages = combine(firstMessages, restMessages)
        return combinedMessages
      }
    } else {
      const firstMatch = { ...rule, matches: rule.matches.slice(0, 1) }
      const restMatches = { ...rule, matches: rule.matches.slice(1) }
      const firstMessages = generateValidMessages(rules, firstMatch)
      const restMessages = generateValidMessages(rules, restMatches)
      const messages = firstMessages.concat(restMessages)
      return messages
    }
  } else {
    console.log('ERROR: invalid rule type')
  }
}

const part1Answer = (lines) => {
  const rules = {}
  let lineNum = 0

  while (lines[lineNum] !== '') {
    const line = lines[lineNum++]
    const [number, rightSide] = line.split(':')
    let matches
    let type
    if (!rightSide.match(/"/)) {
      const alternatives = rightSide.split('|')
      matches = alternatives.map((alternative) => {
        const tokens = alternative.trim().split(' ')
        return tokens.map((token) => parseInt(token, 10))
      })
      type = SUBRULES
    } else {
      matches = rightSide.split('"')[1]
      type = LITERAL
    }
    const rule = { number, matches, type }
    rules[number] = rule
  }
  lineNum++

  const validMessages = generateValidMessages(rules, rules[0])

  let counter = 0
  while (lineNum < lines.length) {
    const message = lines[lineNum++]
    const isValid = validMessages.some(
      (validMessage) => validMessage === message
    )
    console.log(isValid, message)
    counter += isValid ? 1 : 0
  }

  return counter
}

aoc.getResult1 = part1Answer

function getMessagesWithRuleRemoved(rules, rule, message) {
  if (rule.type === LITERAL) {
    const prefix = rule.matches
    if (message.indexOf(prefix) === 0) {
      return [message.slice(prefix.length)]
    } else {
      return []
    }
  } else if (rule.type === SUBRULES) {
    if (rule.matches.length === 0) {
      return message.length === 0 ? [''] : []
    } else if (rule.matches.length === 1) {
      const firstMatch = rule.matches[0]
      if (firstMatch.length === 1) {
        const onlySubRuleNumber = firstMatch[0]
        const subRule = rules[onlySubRuleNumber]
        return getMessagesWithRuleRemoved(rules, subRule, message)
      } else {
        const firstSubRuleNumber = firstMatch[0]
        const firstSubRule = rules[firstSubRuleNumber]
        const restSubRuleNumbers = firstMatch.slice(1)
        const messagesWithFirstSubRuleRemoved = getMessagesWithRuleRemoved(
          rules,
          firstSubRule,
          message
        )
        const combinedMessages = messagesWithFirstSubRuleRemoved
          .map((messageWithFirstSubRuleRemoved) => {
            const newRule = { ...rule, matches: [restSubRuleNumbers] }
            return getMessagesWithRuleRemoved(
              rules,
              newRule,
              messageWithFirstSubRuleRemoved
            )
          })
          .flat()
        return combinedMessages
      }
    } else {
      const firstRule = { ...rule, matches: rule.matches.slice(0, 1) }
      const restRule = { ...rule, matches: rule.matches.slice(1) }
      const firstMessages = getMessagesWithRuleRemoved(
        rules,
        firstRule,
        message
      )
      const restMessages = getMessagesWithRuleRemoved(rules, restRule, message)
      return firstMessages.concat(restMessages)
    }
  } else {
    console.log('ERROR: invalid rule type', rule.type)
  }
}

function isValidForRule(rules, rule, message) {
  if (rule.type === LITERAL) {
    return message === rule.matches
  } else if (rule.type === SUBRULES) {
    if (rule.matches.length === 0) {
      return message.length === 0
    } else if (rule.matches.length === 1) {
      const firstMatch = rule.matches[0]
      if (firstMatch.length === 1) {
        const onlySubRuleNumber = firstMatch[0]
        const subRule = rules[onlySubRuleNumber]
        return isValidForRule(rules, subRule, message)
      } else {
        const firstSubRuleNumber = firstMatch[0]
        const firstSubRule = rules[firstSubRuleNumber]
        const restSubRuleNumbers = firstMatch.slice(1)
        const messagesWithFirstSubRuleRemoved = getMessagesWithRuleRemoved(
          rules,
          firstSubRule,
          message
        )
        const restRule = { ...rule, matches: [restSubRuleNumbers] }
        return messagesWithFirstSubRuleRemoved.some(
          (messageWithFirstSubRuleRemoved) =>
            isValidForRule(rules, restRule, messageWithFirstSubRuleRemoved)
        )
      }
    } else {
      const firstMatch = { ...rule, matches: rule.matches.slice(0, 1) }
      const restMatches = { ...rule, matches: rule.matches.slice(1) }
      return (
        isValidForRule(rules, firstMatch, message) ||
        isValidForRule(rules, restMatches, message)
      )
    }
  } else {
    console.log('ERROR: invalid rule type', rule.type)
    return false
  }
}

aoc.getResult2 = (lines) => {
  const rules = {}
  let lineNum = 0

  while (lines[lineNum] !== '') {
    const line = lines[lineNum++]
    const [ruleNumberStr, rightSide] = line.split(':')
    let matches
    let type
    if (!rightSide.match(/"/)) {
      const alternatives = rightSide.split('|')
      matches = alternatives.map((alternative) => {
        const tokens = alternative.trim().split(' ')
        return tokens.map((token) => parseInt(token, 10))
      })
      type = SUBRULES
    } else {
      matches = rightSide.split('"')[1]
      type = LITERAL
    }
    const ruleNumber = parseInt(ruleNumberStr, 10)
    const rule = { number: ruleNumber, matches, type }
    rules[ruleNumber] = rule
  }
  lineNum++

  let counter = 0
  while (lineNum < lines.length) {
    const message = lines[lineNum++]
    const isValid = isValidForRule(rules, rules[0], message)
    console.log(isValid, message)
    counter += isValid ? 1 : 0
  }

  return counter
}

aoc.run()
