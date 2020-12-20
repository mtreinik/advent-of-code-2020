#!/usr/bin/env node
const aoc = require('./aoc')

function getEdge(tile, maxX, x, y, delta, count) {
  const result = []
  let pos = y * maxX + x
  while (count--) {
    result.push(tile[pos])
    pos += delta
  }
  return result
}

function getEdges(tiles, tileNumber, maxX, maxY) {
  const tile = tiles[tileNumber]
  const topEdge = getEdge(tile, maxX, 0, 0, 1, maxX)
  const leftEdge = getEdge(tile, maxX, 0, 0, maxX, maxY)
  const rightEdge = getEdge(tile, maxX, maxX - 1, 0, maxX, maxY)
  const bottomEdge = getEdge(tile, maxX, 0, maxY - 1, 1, maxX)
  return [
    topEdge.join(''),
    leftEdge.join(''),
    rightEdge.join(''),
    bottomEdge.join(''),
  ]
}

function getRightAndBottomEdges(tiles, tileNumber, maxX, maxY) {
  const tile = tiles[tileNumber]
  const rightEdge = getEdge(tile, maxX, maxX - 1, 0, maxX, maxY)
  const bottomEdge = getEdge(tile, maxX, 0, maxY - 1, 1, maxX)
  return [rightEdge.join(''), bottomEdge.join('')]
}

function getEdgesAndReverseEdges(tiles, tileNumber, maxX, maxY) {
  const edges = getEdges(tiles, tileNumber, maxX, maxY)
  const reverseEdges = edges.map((edge) => edge.split('').reverse().join(''))
  return edges.concat(reverseEdges)
}

function countSameElements(array1, array2) {
  let count = 0
  array1.forEach((element1) =>
    array2.forEach((element2) => {
      if (element1 === element2) {
        // console.log(element1, 'is', element2)
        count++
      }
    })
  )
  return count
}

aoc.getResult1 = (lines) => {
  const tiles = {}
  let lineNum = 0
  let maxY = 0
  let maxX = 0
  while (lineNum < lines.length) {
    const tileNumberLine = lines[lineNum++]
    const [, tileNumberStr] = tileNumberLine.match(/Tile (.*):/)
    let tile = []
    let tileLines = 0
    while (lines[lineNum] !== '' && lineNum < lines.length) {
      const line = lines[lineNum++].split('')
      maxX = Math.max(maxX, line.length)
      tileLines++
      tile = tile.concat(line)
    }
    maxY = Math.max(maxY, tileLines)
    tiles[parseInt(tileNumberStr, 10)] = tile
    lineNum++
  }

  const uniqueEdgeCounts = Object.keys(tiles).map((tileNumber) => {
    const edges = getEdgesAndReverseEdges(tiles, tileNumber, maxX, maxY)

    let sameEdgesCount = 0
    Object.keys(tiles).forEach((otherTileNumber) => {
      if (tileNumber !== otherTileNumber) {
        const otherTileEdges = getEdges(tiles, otherTileNumber, maxX, maxY)
        sameEdgesCount += countSameElements(edges, otherTileEdges)
      }
    })

    return { tileNumber, sameEdgesCount }
  })

  const cornerTiles = uniqueEdgeCounts.filter(
    (uniqueEdgeCount) => uniqueEdgeCount.sameEdgesCount === 2
  )
  const cornerProduct = cornerTiles.reduce(
    (product, cornerTile) => product * cornerTile.tileNumber,
    1
  )

  return cornerProduct
}

function flipTile(tile, maxX, maxY) {
  const newTile = []
  let pos = 0
  for (let y = 0; y < maxY; y++) {
    for (let x = 0; x < maxX; x++) {
      newTile[pos++] = tile[y * maxX + maxX - 1 - x]
    }
  }
  return newTile
}

function rotateTile(tile, maxX, maxY) {
  const newTile = []
  let pos = 0
  for (let y = 0; y < maxY; y++) {
    for (let x = 0; x < maxX; x++) {
      newTile[pos++] = tile[x * maxX + maxX - 1 - y]
    }
  }
  return newTile
}

function getTilePositions(tile1, maxX, maxY) {
  const tile2 = rotateTile(tile1, maxX, maxY)
  const tile3 = rotateTile(tile2, maxX, maxY)
  const tile4 = rotateTile(tile3, maxX, maxY)

  const tile5 = flipTile(tile1, maxX, maxY)
  const tile6 = rotateTile(tile5, maxX, maxY)
  const tile7 = rotateTile(tile6, maxX, maxY)
  const tile8 = rotateTile(tile7, maxX, maxY)

  const result = [tile1, tile2, tile3, tile4, tile5, tile6, tile7, tile8]
  return result
}

function findRightNeighbor(tileNumber, tile, tiles, maxX, maxY) {
  const rightEdge = getEdge(tile, maxX, maxX - 1, 0, maxX, maxY).join('')
  const neighbors = Object.keys(tiles).filter((otherTileNumber) => {
    let sameEdgesCount = 0
    if (tileNumber !== otherTileNumber) {
      const otherTileEdges = getEdgesAndReverseEdges(
        tiles,
        otherTileNumber,
        maxX,
        maxY
      )
      sameEdgesCount += countSameElements([rightEdge], otherTileEdges)
    }
    return sameEdgesCount === 1
  })
  if (neighbors.length !== 1) {
    // no right side neighbor found
    return null
  }
  const neighborNumber = neighbors[0]
  const neighbor = tiles[neighborNumber]
  const rotatedNeighbors = getTilePositions(neighbor, maxX, maxY)
  const rotatedNeighbor = rotatedNeighbors.filter((neighbor) => {
    const leftEdgeOfNeighbor = getEdge(neighbor, maxX, 0, 0, maxX, maxY).join(
      ''
    )
    const isCorrectPosition = rightEdge === leftEdgeOfNeighbor

    return isCorrectPosition
  })[0]
  return { neighborNumber, rotatedNeighbor }
}

function findBottomNeighbor(tileNumber, tile, tiles, maxX, maxY) {
  const bottomEdge = getEdge(tile, maxX, 0, maxY - 1, 1, maxX).join('')
  const neighbors = Object.keys(tiles).filter((otherTileNumber) => {
    let sameEdgesCount = 0
    if (tileNumber !== otherTileNumber) {
      const otherTileEdges = getEdgesAndReverseEdges(
        tiles,
        otherTileNumber,
        maxX,
        maxY
      )
      sameEdgesCount += countSameElements([bottomEdge], otherTileEdges)
    }
    return sameEdgesCount === 1
  })
  if (neighbors.length !== 1) {
    return null
  }
  const neighborNumber = neighbors[0]
  const neighbor = tiles[neighborNumber]
  const rotatedNeighbors = getTilePositions(neighbor, maxX, maxY)
  const rotatedNeighbor = rotatedNeighbors.filter((neighbor) => {
    const topEdgeOfNeighbor = getEdge(neighbor, maxX, 0, 0, 1, maxX).join('')
    const isCorrectPosition = bottomEdge === topEdgeOfNeighbor
    return isCorrectPosition
  })[0]
  return { neighborNumber, rotatedNeighbor }
}

function findRowOfTiles(tileNumber, tile, tiles, maxX, maxY) {
  const rowOfTiles = [tile]
  let rightNeighbor = findRightNeighbor(tileNumber, tile, tiles, maxX, maxY)
  while (rightNeighbor) {
    rowOfTiles.push(rightNeighbor.rotatedNeighbor)
    tileNumber = rightNeighbor.neighborNumber
    tile = rightNeighbor.rotatedNeighbor
    rightNeighbor = findRightNeighbor(tileNumber, tile, tiles, maxX, maxY)
  }
  return rowOfTiles
}

function removeBorders(tile, maxX, maxY) {
  let pos = 0
  const newTile = []
  for (let y = 1; y < maxY - 1; y++) {
    for (let x = 1; x < maxX - 1; x++) {
      newTile[pos++] = tile[y * maxX + x]
    }
  }
  return newTile
}

function showTiles(tiles, maxX, maxY) {
  let pos = 0
  for (let y = 0; y < maxY; y++) {
    let row = ''
    for (let x = 0; x < maxX; x++) {
      row += tiles[pos++]
    }
    console.log(row)
  }
  console.log()
}

function isOn(tiles, maxX, x, y) {
  return tiles[y * maxX + x] === '#'
}

const seaMonsterWidth = 20
const seaMonsterHeight = 3
function isSeaMonster(tiles, maxX, x, y) {
  const seaMonsterCoordinates = [
    [18, 2],
    [0, 1],
    [5, 1],
    [6, 1],
    [11, 1],
    [12, 1],
    [17, 1],
    [18, 1],
    [19, 1],
    [1, 0],
    [4, 0],
    [7, 0],
    [10, 0],
    [13, 0],
    [16, 0],
  ]
  return seaMonsterCoordinates.every((seaMonsterCoordinate) => {
    const sx = x + seaMonsterCoordinate[0]
    const sy = y + seaMonsterCoordinate[1]
    const on = isOn(tiles, maxX, sx, sy)
    return on
  })
}

function countSeaMonsters(map, maxX, maxY) {
  const mapPositions = getTilePositions(map, maxX, maxY)
  let count = 0
  mapPositions.forEach((mapPosition) => {
    for (let y = 0; y <= maxY - seaMonsterHeight; y++) {
      for (let x = 0; x <= maxX - seaMonsterWidth; x++) {
        const isMonster = isSeaMonster(mapPosition, maxX, x, y)
        if (isMonster) {
          // console.log('monster at', x, y, 'of map position', mapPosition)
          count++
        }
      }
    }
  })
  return count
}

aoc.getResult2 = (lines) => {
  const tiles = {}
  let lineNum = 0
  let maxY = 0
  let maxX = 0
  while (lineNum < lines.length) {
    const tileNumberLine = lines[lineNum++]
    const [, tileNumberStr] = tileNumberLine.match(/Tile (.*):/)
    let tile = []
    let tileLines = 0
    while (lines[lineNum] !== '' && lineNum < lines.length) {
      const line = lines[lineNum++].split('')
      maxX = Math.max(maxX, line.length)
      tileLines++
      tile = tile.concat(line)
    }
    maxY = Math.max(maxY, tileLines)
    tiles[parseInt(tileNumberStr, 10)] = tile
    lineNum++
  }
  console.log('tile size is ', maxY, 'by', maxX)

  const uniqueEdgeCounts = Object.keys(tiles).map((tileNumber) => {
    const edges = getEdgesAndReverseEdges(tiles, tileNumber, maxX, maxY)

    const rightAndBottomEdges = getRightAndBottomEdges(
      tiles,
      tileNumber,
      maxX,
      maxY
    )

    let sameEdgesCount = 0
    let rightAndBottomEdgesCount = 0
    Object.keys(tiles).forEach((otherTileNumber) => {
      if (tileNumber !== otherTileNumber) {
        const otherTileEdges = getEdges(tiles, otherTileNumber, maxX, maxY)
        sameEdgesCount += countSameElements(edges, otherTileEdges)

        rightAndBottomEdgesCount += countSameElements(
          rightAndBottomEdges,
          otherTileEdges
        )
      }
    })

    return { tileNumber, sameEdgesCount, rightAndBottomEdgesCount }
  })

  const cornerTiles = uniqueEdgeCounts.filter(
    (uniqueEdgeCount) => uniqueEdgeCount.sameEdgesCount === 2
  )
  const topLeftTileNumber = cornerTiles.filter(
    (tile) => tile.rightAndBottomEdgesCount === 2
  )[0].tileNumber
  const topLeftTile = tiles[topLeftTileNumber]

  let leftTileNumber = topLeftTileNumber
  let leftTile = topLeftTile

  const rowOfTiles = findRowOfTiles(
    topLeftTileNumber,
    topLeftTile,
    tiles,
    maxX,
    maxY
  )
  const arrangedTiles = [rowOfTiles]
  let bottomNeighbor = findBottomNeighbor(
    leftTileNumber,
    leftTile,
    tiles,
    maxX,
    maxY
  )
  while (bottomNeighbor) {
    leftTileNumber = bottomNeighbor.neighborNumber
    leftTile = bottomNeighbor.rotatedNeighbor
    const nextRowOfTiles = findRowOfTiles(
      leftTileNumber,
      leftTile,
      tiles,
      maxX,
      maxY
    )
    arrangedTiles.push(nextRowOfTiles)
    bottomNeighbor = findBottomNeighbor(
      leftTileNumber,
      leftTile,
      tiles,
      maxX,
      maxY
    )
  }

  const arrangedTilesWithNoBorders = arrangedTiles.map((row) =>
    row.map((tile) => removeBorders(tile, maxX, maxY))
  )

  const combinedTiles = []
  const rowLength = arrangedTilesWithNoBorders[0].length * (maxX - 2)
  for (let y = 0; y < 8 * 3; y++) {
    for (let x = 0; x < 8 * 3; x++) {
      combinedTiles[y * rowLength + x] = '-'
    }
  }
  const rows = arrangedTilesWithNoBorders.length
  const columns = arrangedTilesWithNoBorders[0].length
  const width = columns * (maxX - 2)
  const height = rows * (maxY - 2)
  arrangedTilesWithNoBorders.forEach((row, rowIndex) =>
    row.forEach((tile, columnIndex) => {
      for (let y = 0; y < maxY - 2; y++) {
        for (let x = 0; x < maxX - 2; x++) {
          const pos =
            (rowIndex * (maxY - 2) + y) * rowLength +
            columnIndex * (maxX - 2) +
            x
          combinedTiles[pos] = tile[y * (maxX - 2) + x]
        }
      }
    })
  )
  showTiles(combinedTiles, width, height)

  const seaMonsterCount = countSeaMonsters(combinedTiles, width, height)

  const waterCount = combinedTiles.reduce(
    (waterCount, pixel) => (pixel === '#' ? waterCount + 1 : waterCount),
    0
  )
  console.log('waterCount', waterCount)
  console.log('seaMonsterCount', seaMonsterCount)
  return waterCount - seaMonsterCount * 15
}

aoc.run()
