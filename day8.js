#!/usr/bin/env node
const aoc = require('./aoc')

function parseLine(line) {
  const [instr, valStr] = line.split(' ')
  const val = parseInt(valStr, 10)
  return { instr, val }
}

function runProgram(lines) {
  let acc = 0
  let addr = 0
  const runLines = []
  while (!runLines[addr] && addr < lines.length) {
    runLines[addr] = true
    const { instr, val } = parseLine(lines[addr])
    switch (instr) {
      case 'nop':
        addr++
        break
      case 'acc':
        acc += val
        addr++
        break
      case 'jmp':
        addr += val
        break
    }
  }
  return { addr, acc, infiniteLoop: runLines[addr] }
}

aoc.getResult1 = (lines) => {
  const { acc } = runProgram(lines)
  return acc
}

aoc.getResult2 = (lines) => {
  for (let i = 0; i < lines.length; i++) {
    const { instr, val } = parseLine(lines[i])
    const program = [...lines]
    let changed = false
    switch (instr) {
      case 'nop':
        program[i] = 'jmp ' + val
        changed = true
        break
      case 'jmp':
        program[i] = 'nop ' + val
        changed = true
        break
    }
    if (changed) {
      const result = runProgram(program)
      if (!result.infiniteLoop) {
        return result.acc
      }
    }
  }
  return 'failed'
}

aoc.run()
