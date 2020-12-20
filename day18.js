#!/usr/bin/env node
const aoc = require('./aoc')

function getTokens(line) {
  const tokens = []
  for (let pos = 0; pos < line.length; pos++) {
    const char = line[pos]
    switch (char) {
      case '(':
      case ')':
      case '+':
      case '*':
        tokens.push(char)
        break
      case ' ':
        break
      default: {
        let token = char
        while (line[pos + 1] && line[pos + 1].toString().match(/[0-9]/)) {
          console.log('  adding ', pos + 1)
          token += line[pos + 1]
          pos++
        }
        tokens.push(parseInt(token, 10))
      }
    }
  }
  return tokens
}

function calculatePart1(line) {
  const tokens = getTokens(line)
  let pos = 0

  function accept(expectedToken) {
    if (tokens[pos] === expectedToken) {
      pos++
    } else {
      console.log('ERROR: expected', expectedToken, 'got', tokens[pos])
    }
  }

  function factor() {
    const token = tokens[pos]
    if (token === '(') {
      accept('(')
      const value = expression()
      accept(')')
      return value
    } else {
      // token is number
      pos++
      return token
    }
  }

  function expression() {
    let left = factor()
    while (true) {
      if (pos === tokens.length) {
        break
      }
      if (tokens[pos] === '*') {
        pos++
        const right = factor()
        left = left * right
      } else if (tokens[pos] === '+') {
        pos++
        const right = factor()
        left = left + right
      } else {
        break
      }
    }
    return left
  }

  return expression()
}

aoc.getResult1 = (lines) => {
  let result = 0
  lines.forEach((line) => {
    const answer = calculatePart1(line)
    result += answer
  })
  return result
}

function calculatePart2(line) {
  const tokens = getTokens(line)
  let pos = 0

  function accept(expectedToken) {
    if (tokens[pos] === expectedToken) {
      pos++
    } else {
      console.log('ERROR: expected', expectedToken, 'got', tokens[pos])
    }
  }

  function factor() {
    const token = tokens[pos]
    if (token === '(') {
      accept('(')
      const value = expression()
      accept(')')
      return value
    } else {
      // token is number
      pos++
      return token
    }
  }

  function term() {
    let left = factor()
    while (true) {
      if (pos === tokens.length || tokens[pos] !== '+') {
        break
      }
      accept('+')
      const right = factor()
      left = left + right
    }
    return left
  }

  function expression() {
    let left = term()
    while (true) {
      if (pos === tokens.length || tokens[pos] !== '*') {
        break
      }
      accept('*')
      const right = term()
      left = left * right
    }
    return left
  }

  return expression()
}

aoc.getResult2 = (lines) => {
  let result = 0
  lines.forEach((line) => {
    const answer = calculatePart2(line)
    // console.log('answer', answer)
    result += answer
  })
  return result
}

aoc.run()
