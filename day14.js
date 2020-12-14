#!/usr/bin/env node
/* globals BigInt */
const aoc = require('./aoc')

function applyMask(value, mask) {
  let bit = 1n
  mask.forEach((maskBit) => {
    switch (maskBit) {
      case '0':
        if (value & bit) {
          value -= bit
        }
        break
      case '1':
        if (!(value & bit)) {
          value |= bit
        }
        break
    }
    bit <<= 1n
  })
  return value
}

// this was used for debugging
// eslint-disable-next-line no-unused-vars
function getBits(bigInt) {
  let bits = ''
  let counter = 0
  for (let a = bigInt; a > 0n; a >>= 1n) {
    if (a & 1n) {
      bits = '1' + bits
    } else {
      bits = '0' + bits
    }
    if (++counter % 8 === 0) {
      bits = ' ' + bits
    }
  }
  return bits
}

aoc.getResult1 = (lines) => {
  const mem = {}
  let mask = 0
  lines.forEach((line) => {
    const [, command, strValue] = /(.*) = (.*)/.exec(line)
    if (command === 'mask') {
      mask = strValue.split('').reverse()
    } else {
      const parsedValue = parseInt(strValue, 10)
      const value = BigInt(parsedValue)
      const maskedValue = applyMask(value, mask)

      const [, strAddr] = /mem\[(\d*)\]/.exec(command)
      const addr = parseInt(strAddr, 10)

      mem[addr] = maskedValue
    }
  })

  const totalSum = Object.keys(mem).reduce(
    (totalSum, key) => totalSum + mem[key],
    0n
  )

  return totalSum
}

function getFloatingValues(addr, floatingBits) {
  if (floatingBits.length === 0) {
    return [addr]
  } else {
    const floatingBit = floatingBits[0]
    const otherFloatingBits = floatingBits.slice(1)

    const otherValues = getFloatingValues(addr, otherFloatingBits)

    return otherValues.concat(otherValues.map((val) => val | floatingBit))
  }
}

function getAddresses(addr, mask) {
  let bit = 1n
  let modifiedAddr = addr
  const floatingBits = []
  mask.forEach((maskBit) => {
    switch (maskBit) {
      case '1':
        modifiedAddr |= bit
        break
      case 'X':
        if (addr & bit) {
          modifiedAddr -= bit
        }
        floatingBits.push(bit)
        break
    }
    bit <<= 1n
  })
  return getFloatingValues(modifiedAddr, floatingBits)
}

aoc.getResult2 = (lines) => {
  const mem = {}
  let mask = 0
  lines.forEach((line) => {
    const [, command, strValue] = /(.*) = (.*)/.exec(line)
    if (command === 'mask') {
      mask = strValue.split('').reverse()
    } else {
      const parsedValue = parseInt(strValue, 10)
      const value = BigInt(parsedValue)

      const [, strAddr] = /mem\[(\d*)\]/.exec(command)
      const addr = BigInt(parseInt(strAddr, 10))
      const addresses = getAddresses(addr, mask)

      addresses.forEach((addr) => {
        mem[addr] = value
      })
    }
  })
  let totalSum = 0n
  for (const key of Object.keys(mem)) {
    totalSum += mem[key]
  }
  return totalSum
}

aoc.run()
