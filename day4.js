#!/usr/bin/env node
const aoc = require('./aoc')

const REQUIRED_FIELDS = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']
const VALID_EYE_COLORS = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth']

function hasAllKeys(array, expectedKeys) {
  return expectedKeys.every((expectedKey) => array[expectedKey])
}

function incrementIfTrue(counter, condition) {
  return condition ? counter + 1 : counter
}

aoc.getResult1 = (lines) => {
  let valid = 0

  let foundFields = []
  lines.forEach((line) => {
    if (line === '') {
      valid = incrementIfTrue(valid, hasAllKeys(foundFields, REQUIRED_FIELDS))
      foundFields = []
    } else {
      const fields = line.split(' ')
      fields.forEach((field) => {
        const [fieldName] = field.split(':')
        foundFields[fieldName] = true
      })
    }
  })
  valid = incrementIfTrue(valid, hasAllKeys(foundFields, REQUIRED_FIELDS))
  return valid
}

function hasIntegerRange(value, min, max) {
  const integer = parseInt(value, 10)
  return !isNaN(integer) && min <= integer && integer <= max
}

function isValidFieldValue(fieldName, fieldValue) {
  switch (fieldName) {
    case 'byr':
      return hasIntegerRange(fieldValue, 1920, 2002)
    case 'iyr':
      return hasIntegerRange(fieldValue, 2010, 2020)
    case 'eyr':
      return hasIntegerRange(fieldValue, 2020, 2030)
    case 'hgt':
      if (fieldValue.match(/\d+cm/)) {
        const [h] = fieldValue.split('cm')
        return hasIntegerRange(h, 150, 193)
      } else if (fieldValue.match(/\d+in/)) {
        const [h] = fieldValue.split('in')
        return hasIntegerRange(h, 59, 76)
      }
      break
    case 'hcl':
      return !!fieldValue.match(/^#[0-9a-f]{6}$/)
    case 'ecl':
      return VALID_EYE_COLORS.includes(fieldValue)
    case 'pid':
      return fieldValue.match(/^[0-9]{9}$/)
  }
  return false
}

aoc.getResult2 = (lines) => {
  let valid = 0

  let validFields = []
  lines.forEach((line) => {
    if (line === '') {
      valid = incrementIfTrue(valid, hasAllKeys(validFields, REQUIRED_FIELDS))
      validFields = []
    } else {
      const fields = line.split(' ')
      fields.forEach((field) => {
        const [fieldName, fieldValue] = field.split(':')
        const isValid = isValidFieldValue(fieldName, fieldValue)
        if (isValid) {
          validFields[fieldName] = true
        }
      })
    }
  })
  valid = incrementIfTrue(valid, hasAllKeys(validFields, REQUIRED_FIELDS))
  return valid
}

aoc.run()
