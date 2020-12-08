const readline = require('readline')

module.exports = {
  // default values
  parseLine: (line) => line,
  preProcessLines: (lines) => lines,
  getResult1: (lines) =>
    `Please replace aoc.getResult1 with own implementation using ${lines}`,
  getResult2: (lines) =>
    `Please replace aoc.getResult2 with own implementation using ${lines}`,

  run: function (debug) {
    const lines = []

    const rl = readline.createInterface({
      input: process.stdin,
    })

    rl.on('line', (line) => lines.push(this.parseLine(line)))

    rl.on('close', () => {
      if (debug) {
        console.log('lines', lines)
      }
      const preProcessedLines = this.preProcessLines(lines)
      if (debug) {
        console.log('preProcessedLines', preProcessedLines)
      }
      const result1 = this.getResult1(preProcessedLines)
      const result2 = this.getResult2(preProcessedLines)
      console.log('part 1:', result1, 'part 2:', result2)
    })
  },
}
