#!/usr/bin/env gawk -f

function findProductOfTwoNumbersWithSum(numbers, len, sumToFind) {
  first = 0
  second = len
  while (first < second) {
    sum = numbers[first] + numbers[second]
    if (sum < sumToFind) {
      first++
    } else if (sum > sumToFind) {
      second--
    } else {
      return numbers[first] * numbers[second]
    }
  }
  return 0
}

function findProductOfThreeNumbersWithSum(numbers, len, number, result, sumToFind) {
  product = findProductOfTwoNumbersWithSum(numbers, len, sumToFind - number)
  if (product > 0) {
    return number * product
  } else {
    return result
  }
}

{
  numbers[l++] = $0
}

END {
  len = asort(numbers)

  result1 = findProductOfTwoNumbersWithSum(numbers, len, 2020)
  for (i in numbers) {
    result2 = findProductOfThreeNumbersWithSum(numbers, len, numbers[i], result2, 2020)
  }

  print "part 1: " result1 " part 2: " result2
}