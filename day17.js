#!/usr/bin/env node
const aoc = require('./aoc')

aoc.parseLine = (line) => line.split('').map((char) => (char === '#' ? 1 : 0))

function getMinAndMaxKey(object) {
  let min = Number.MAX_SAFE_INTEGER
  let max = Number.MIN_SAFE_INTEGER
  if (!object) {
    return [min, max]
  }
  for (const key of Object.keys(object)) {
    min = Math.min(min, key)
    max = Math.max(max, key)
  }
  return [min, max]
}

function getMinAndMaxY(object) {
  let min = Number.MAX_SAFE_INTEGER
  let max = Number.MIN_SAFE_INTEGER
  if (!object) {
    return [min, max]
  }
  for (const z of Object.keys(object)) {
    const [localMin, localMax] = getMinAndMaxKey(object[z])
    min = Math.min(min, localMin)
    max = Math.max(max, localMax)
  }
  return [min, max]
}

function getMinAndMaxX(object) {
  let min = Number.MAX_SAFE_INTEGER
  let max = Number.MIN_SAFE_INTEGER
  if (!object) {
    return [min, max]
  }
  for (const z of Object.keys(object)) {
    for (const y of Object.keys(object[z])) {
      const [localMin, localMax] = getMinAndMaxKey(object[z][y])
      min = Math.min(min, localMin)
      max = Math.max(max, localMax)
    }
  }
  return [min, max]
}

function getMinAndMax4D(object) {
  let min = Number.MAX_SAFE_INTEGER
  let max = Number.MIN_SAFE_INTEGER
  if (!object) {
    return [min, max]
  }
  for (const z of Object.keys(object)) {
    for (const y of Object.keys(object[z])) {
      for (const x of Object.keys(object[z][y])) {
        const [localMin, localMax] = getMinAndMaxKey(object[z][y][x])
        min = Math.min(min, localMin)
        max = Math.max(max, localMax)
      }
    }
  }
  return [min, max]
}

function show3DCubes(cubes) {
  for (const z of Object.keys(cubes)) {
    console.log('z', z)
    for (const y of Object.keys(cubes[z])) {
      let row = ''
      for (const x of Object.keys(cubes[z][y])) {
        row += cubes[z][y][x] ? '#' : '.'
      }
      console.log(row)
    }
    console.log()
  }
}

function get3DCube(cubes, x, y, z) {
  const [minZ, maxZ] = getMinAndMaxKey(cubes)
  if (z < minZ || z > maxZ) {
    return 0
  }
  const [minY, maxY] = getMinAndMaxKey(cubes[z])
  if (y < minY || y > maxY) {
    return 0
  }
  const [minX, maxX] = getMinAndMaxKey(cubes[z][y])
  if (x < minX || x > maxX) {
    return 0
  }
  return cubes[z][y][x]
}

function set3DCube(cubes, x, y, z, value) {
  const [minZ, maxZ] = getMinAndMaxKey(cubes)
  if (z < minZ || z > maxZ) {
    cubes[z] = {}
  }
  const [minY, maxY] = getMinAndMaxKey(cubes[z])
  if (y < minY || y > maxY) {
    cubes[z][y] = {}
  }
  cubes[z][y][x] = value

  return cubes
}

function move3DCubes(cubes) {
  const [minZ, maxZ] = getMinAndMaxKey(cubes)
  let newCubes = {}
  for (let z = minZ - 1; z <= maxZ + 1; z++) {
    const [minY, maxY] = getMinAndMaxY(cubes)
    for (let y = minY - 1; y <= maxY + 1; y++) {
      const [minX, maxX] = getMinAndMaxX(cubes)
      for (let x = minX - 1; x <= maxX + 1; x++) {
        let neighborCount = 0
        for (let dz = -1; dz <= 1; dz++) {
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (
                Math.abs(dx) === 1 ||
                Math.abs(dy) === 1 ||
                Math.abs(dz) === 1
              ) {
                neighborCount += get3DCube(cubes, x + dx, y + dy, z + dz)
              }
            }
          }
        }
        const isActive = get3DCube(cubes, x, y, z)
        const isActiveAndHasProperAmountOfNeighbors =
          isActive && (neighborCount === 2 || neighborCount === 3)
        const isNotActiveAndHasProperAmountOfNeighbors =
          !isActive && neighborCount === 3
        const shouldBeOn =
          isActiveAndHasProperAmountOfNeighbors ||
          isNotActiveAndHasProperAmountOfNeighbors
        const newValue = shouldBeOn ? 1 : 0
        newCubes = set3DCube(newCubes, x, y, z, newValue)
      }
    }
  }
  return newCubes
}

function count3DCubes(cubes) {
  let counter = 0
  for (const z of Object.keys(cubes)) {
    for (const y of Object.keys(cubes[z])) {
      for (const x of Object.keys(cubes[z][y])) {
        counter += cubes[z][y][x] ? 1 : 0
      }
    }
  }
  return counter
}

aoc.getResult1 = (lines) => {
  let cubes = {}
  cubes[0] = {}
  lines.forEach((line, y) => {
    cubes[0][y] = {}
    line.forEach((char, x) => (cubes[0][y][x] = char))
  })
  show3DCubes(cubes)
  for (let i = 0; i < 6; i++) {
    cubes = move3DCubes(cubes)
    // showCubes(cubes)
  }
  const counter = count3DCubes(cubes)
  return counter
}

// part2

function show4DCubes(cubes) {
  for (const w of Object.keys(cubes)) {
    for (const z of Object.keys(cubes[w])) {
      console.log('z', z, 'w', w)
      for (const y of Object.keys(cubes[w][z])) {
        let row = ''
        for (const x of Object.keys(cubes[w][z][y])) {
          row += cubes[w][z][y][x] ? '#' : '.'
        }
        console.log(row)
      }
      console.log()
    }
  }
}

function get4DCube(cubes, x, y, z, w) {
  const [minW, maxW] = getMinAndMaxKey(cubes)
  if (w < minW || w > maxW) {
    return 0
  }
  const [minZ, maxZ] = getMinAndMaxKey(cubes[w])
  if (z < minZ || z > maxZ) {
    return 0
  }
  const [minY, maxY] = getMinAndMaxKey(cubes[w][z])
  if (y < minY || y > maxY) {
    return 0
  }
  const [minX, maxX] = getMinAndMaxKey(cubes[w][z][y])
  if (x < minX || x > maxX) {
    return 0
  }
  return cubes[w][z][y][x]
}

function set4DCube(cubes, x, y, z, w, value) {
  const [minW, maxW] = getMinAndMaxKey(cubes)
  if (w < minW || w > maxW) {
    cubes[w] = {}
  }
  const [minZ, maxZ] = getMinAndMaxKey(cubes[w])
  if (z < minZ || z > maxZ) {
    cubes[w][z] = {}
  }
  const [minY, maxY] = getMinAndMaxKey(cubes[w][z])
  if (y < minY || y > maxY) {
    cubes[w][z][y] = {}
  }
  cubes[w][z][y][x] = value
  return cubes
}

function move4DCubes(cubes) {
  const [minW, maxW] = getMinAndMaxKey(cubes)
  let newCubes = {}
  for (let w = minW - 1; w <= maxW + 1; w++) {
    const [minZ, maxZ] = getMinAndMaxY(cubes)
    for (let z = minZ - 1; z <= maxZ + 1; z++) {
      const [minY, maxY] = getMinAndMaxX(cubes)
      for (let y = minY - 1; y <= maxY + 1; y++) {
        const [minX, maxX] = getMinAndMax4D(cubes)
        for (let x = minX - 1; x <= maxX + 1; x++) {
          let neighborCount = 0
          for (let dw = -1; dw <= 1; dw++) {
            for (let dz = -1; dz <= 1; dz++) {
              for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                  if (
                    Math.abs(dx) === 1 ||
                    Math.abs(dy) === 1 ||
                    Math.abs(dz) === 1 ||
                    Math.abs(dw) === 1
                  ) {
                    neighborCount += get4DCube(cubes, x + dx, y + dy, z + dz, w + dw)
                  }
                }
              }
            }
          }
          const isActive = get4DCube(cubes, x, y, z, w)
          const isActiveAndHasProperAmountOfNeighbors =
            isActive && (neighborCount === 2 || neighborCount === 3)
          const isNotActiveAndHasProperAmountOfNeighbors =
            !isActive && neighborCount === 3
          const shouldBeOn =
            isActiveAndHasProperAmountOfNeighbors ||
            isNotActiveAndHasProperAmountOfNeighbors
          const newValue = shouldBeOn ? 1 : 0
          newCubes = set4DCube(newCubes, x, y, z, w, newValue)
        }
      }
    }
  }
  return newCubes
}

function count4DCubes(cubes) {
  let counter = 0
  for (const w of Object.keys(cubes)) {
    for (const z of Object.keys(cubes[w])) {
      for (const y of Object.keys(cubes[w][z])) {
        for (const x of Object.keys(cubes[w][z][y])) {
          counter += cubes[w][z][y][x] ? 1 : 0
        }
      }
    }
  }
  return counter
}

aoc.getResult2 = (lines) => {
  let cubes = {}
  cubes[0] = {}
  cubes[0][0] = {}
  lines.forEach((line, y) => {
    cubes[0][0][y] = {}
    line.forEach((char, x) => (cubes[0][0][y][x] = char))
  })
  show4DCubes(cubes)
  for (let i = 0; i < 6; i++) {
    cubes = move4DCubes(cubes)
    show4DCubes(cubes)
  }
  const counter = count4DCubes(cubes)
  return counter
}

aoc.run()
