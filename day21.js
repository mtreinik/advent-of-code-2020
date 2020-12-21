#!/usr/bin/env node
const aoc = require('./aoc')

// returns elements that are present in array1 and array2
function intersection(array1, array2) {
  return array1.filter((element1) => array2.includes(element1))
}

// removes contents of array2 from array1
function remove(array1, array2) {
  return array1.filter((element1) => !array2.includes(element1))
}

function parseInput(lines) {
  const allergenFoods = {}
  const foodCounts = {}
  lines.forEach((line) => {
    const [foodsStr, allergensStr] = line.split(' (contains ')
    const lineFoods = foodsStr.split(' ')
    const lineAllergens = allergensStr.slice(0, -1).replace(/,/g, '').split(' ')
    lineFoods.forEach((food) => {
      foodCounts[food] = foodCounts[food] ? foodCounts[food] + 1 : 1
    })
    lineAllergens.forEach((allergen) => {
      allergenFoods[allergen] = allergenFoods[allergen]
        ? intersection(allergenFoods[allergen], lineFoods)
        : lineFoods
    })
  })
  return { allergenFoods, foodCounts }
}

function getAllergenWithOneFood(allergenFoods) {
  const allergen = Object.keys(allergenFoods).find((allergen) => {
    return allergenFoods[allergen].length === 1
  })
  if (allergen) {
    const food = allergenFoods[allergen][0]
    return { allergen, food }
  }
  return null
}

function removeFood(allergenFoods, foodToRemove) {
  const newAllergenFoods = {}
  Object.keys(allergenFoods).forEach((allergen) => {
    const foods = allergenFoods[allergen]
    const newFoods = foods.filter((food) => food !== foodToRemove)
    if (newFoods.length > 0) {
      newAllergenFoods[allergen] = newFoods
    }
  })
  return newAllergenFoods
}

aoc.getResult1 = (lines) => {
  const { allergenFoods, foodCounts } = parseInput(lines)

  const allergenicFoods = []
  let remainingAllergenFoods = allergenFoods
  let allergenAndOneFood = getAllergenWithOneFood(remainingAllergenFoods)
  while (allergenAndOneFood) {
    const { food } = allergenAndOneFood
    allergenicFoods.push(food)
    remainingAllergenFoods = removeFood(remainingAllergenFoods, food)
    allergenAndOneFood = getAllergenWithOneFood(remainingAllergenFoods)
  }

  const safeFoods = remove(Object.keys(foodCounts), allergenicFoods)

  let safeFoodsCount = 0
  safeFoods.forEach((safeFood) => (safeFoodsCount += foodCounts[safeFood]))

  return safeFoodsCount
}

aoc.getResult2 = (lines) => {
  const { allergenFoods, foodCounts } = parseInput(lines)

  const allergenicFoods = []
  let remainingAllergenFoods = allergenFoods
  let allergenAndOneFood = getAllergenWithOneFood(remainingAllergenFoods)
  const allergenOfFood = {}
  while (allergenAndOneFood) {
    const { allergen, food } = allergenAndOneFood
    allergenicFoods.push(food)
    allergenOfFood[food] = allergen
    remainingAllergenFoods = removeFood(remainingAllergenFoods, food)
    allergenAndOneFood = getAllergenWithOneFood(remainingAllergenFoods)
  }

  const safeFoods = remove(Object.keys(foodCounts), allergenicFoods)

  let safeFoodsCount = 0
  safeFoods.forEach((safeFood) => (safeFoodsCount += foodCounts[safeFood]))

  const dangerousFoodsSortedByAllergens = Object.keys(
    allergenOfFood
  ).sort((a, b) => allergenOfFood[a].localeCompare(allergenOfFood[b]))

  return dangerousFoodsSortedByAllergens.join(',')
}

aoc.run()
