#!/usr/bin/env node
const aoc = require('./aoc')

function playRound(decks) {
  const deck1 = decks[0]
  const deck2 = decks[1]
  const card1 = deck1.shift()
  const card2 = deck2.shift()
  if (card1 > card2) {
    deck1.push(card1)
    deck1.push(card2)
  } else {
    deck2.push(card2)
    deck2.push(card1)
  }
  return decks
}

function parseDecks(lines) {
  const decks = []
  let lineNum = 1
  while (lineNum < lines.length) {
    const deck = []
    while (lines[lineNum] !== '' && lineNum < lines.length) {
      deck.push(parseInt(lines[lineNum++], 10))
    }
    decks.push(deck)
    lineNum += 2
  }
  return decks
}

aoc.getResult1 = (lines) => {
  let decks = parseDecks(lines)
  while (decks[0].length > 0 && decks[1].length > 0) {
    decks = playRound(decks)
  }
  const winningDeck = decks[0].length > 0 ? decks[0] : decks[1]

  let score = 0
  for (let i = 0; i < winningDeck.length; i++) {
    score += winningDeck[i] * (winningDeck.length - i)
  }

  return score
}

function updateWinner(isPlayer1Winner, deck1, deck2, card1, card2) {
  if (isPlayer1Winner) {
    deck1.push(card1)
    deck1.push(card2)
  } else {
    deck2.push(card2)
    deck2.push(card1)
  }
}

function playRecursiveRound(decks, previousRounds) {
  const deck1 = decks[0]
  const deck2 = decks[1]
  const previousRoundId = deck1.join(',') + '-' + deck2.join(',')
  if (previousRounds[previousRoundId]) {
    return {
      decks: [deck1, []],
      previousRounds,
    }
  } else {
    previousRounds[previousRoundId] = true

    const card1 = deck1.shift()
    const card2 = deck2.shift()

    if (deck1.length >= card1 && deck2.length >= card2) {
      const subGameDecks = [deck1.slice(0, card1), deck2.slice(0, card2)]
      const subGameWinningDecks = playGame(subGameDecks, {})
      updateWinner(
        subGameWinningDecks[0].length > 0,
        deck1,
        deck2,
        card1,
        card2
      )
    } else {
      updateWinner(card1 > card2, deck1, deck2, card1, card2)
    }
  }
  return { decks, previousRounds }
}

function playGame(decks, previousRounds) {
  while (decks[0].length > 0 && decks[1].length > 0) {
    ;({ decks, previousRounds } = playRecursiveRound(decks, previousRounds))
  }
  return decks
}

aoc.getResult2 = (lines) => {
  const decks = parseDecks(lines)

  const winningDecks = playGame(decks, {})
  const winningDeck =
    winningDecks[0].length > 0 ? winningDecks[0] : winningDecks[1]

  let score = 0
  for (let i = 0; i < winningDeck.length; i++) {
    score += winningDeck[i] * (winningDeck.length - i)
  }
  return score
}

aoc.run()
