#!/usr/bin/env node
const aoc = require('./aoc')

const expectedFields = [
'byr',
'iyr'  ,
'eyr'  ,
'hgt'  ,
'hcl'  ,
'ecl'  ,
'pid'
//'cid'
]

function getAllFound(expectedFields, foundFields ) {
  let allFound = true
  expectedFields.forEach(expected => {
    if (!foundFields[expected]) {
      console.log('field', expected, 'not found => INVALID')
      allFound = false
    }
  })
  return allFound
}

aoc.getResult1 = (lines) => {
  let valid = 0

  let foundFields = []
  lines.forEach((line) => {
    if (line === '') {
      console.log('validating', foundFields)
      const allFound = getAllFound(expectedFields, foundFields)
      if (allFound) {
        console.log('VALID')
        valid++
      }
      foundFields = []
    } else {
      const fields = line.split(' ')
      fields.forEach(field => {
        const [fieldName, _] = field.split(':')
        //console.log('fieldName', fieldName)
        foundFields[fieldName] = true
      })
    }
  })
  const allFound = getAllFound(expectedFields, foundFields)
  if (allFound) {
    console.log('LAST VALID')
    valid++
  }
  return valid
}

aoc.getResult2 = (lines) => {
  let valid = 0

  let foundFields = []
  lines.forEach((line) => {
    if (line === '') {
      console.log('validating', foundFields)
      const allFound = getAllFound(expectedFields, foundFields)
      if (allFound) {
        console.log('VALID')
        valid++
      }
      foundFields = []
    } else {
      const fields = line.split(' ')
      fields.forEach(field => {
        const [fieldName, fieldValue] = field.split(':')
        let isValid = false
        switch (fieldName) {
          case 'byr':
            const num = parseInt(fieldValue, 10)
            isValid = 1920 <= num && num <= 2002
            break;
          case 'iyr':
            const num2 = parseInt(fieldValue, 10)
            isValid = 2010 <= num2 && num2 <= 2020
            break;
          case 'eyr':
            const num3 = parseInt(fieldValue, 10)
            isValid = 2020 <= num3 && num3 <= 2030
            break
          case 'hgt':
            if (fieldValue.match(/\d+cm/)) {
              const [h] = fieldValue.split('cm')
              isValid = 150 <= h && h <= 193
            } else if (fieldValue.match(/\d+in/)) {
              const [h] = fieldValue.split('in')
              isValid = 59 <= h && h <= 76
            }
            break;
          case 'hcl':
            isValid = !!fieldValue.match(/^#[0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f]$/)
            break;
          case 'ecl':
            isValid = fieldValue === 'amb' ||
              fieldValue === 'blu' ||
              fieldValue === 'brn' ||
              fieldValue === 'gry' ||
              fieldValue === 'grn' ||
              fieldValue === 'hzl' ||
              fieldValue === 'oth'
            break;
          case 'pid':
            isValid = fieldValue.match(/^[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]$/)
            break;
        }
        if (isValid) {
          foundFields[fieldName] = true
        }
      })
    }
  })
  const allFound = getAllFound(expectedFields, foundFields)
  if (allFound) {
    console.log('LAST VALID')
    valid++
  }
  return valid
}

aoc.run()
