# advent-of-code-2020

My participation to [Advent of Code 2020](https://adventofcode.com/)

## Day 1: Report Repair

### Algorithm for part one

1. put input entries in an array `numbers`
1. sort array by ascending order
1. start `first` at first element of array
1. start `second` at last element of array
1. calculate sum `numbers[first] + numbers[second]`
1. if sum is less than 2020, move `first` to next element
1. if sum is greater than 2020, move `second` to previous element
1. if sum equals 2020, return `numbers[first] * numbers[second]`
1. if `first` and `second` point to the same element, no match was found
1. repeat from calculating the sum

Finding the matching pair of numbers has complexity `O(n)`,
which is dominated by complexity of sorting, which is, depending on implementation `O(n log n)`.

### Algorithm for part two

1. Run algorithm of part 1 for each `number` in the array, looking for sum that equals `2020 - number`

This algorithm has complexity `O(n^2)`.

### Running the program

```
$ nvm use
$ ./day1.js < simple-input-day1.txt
part 1: 514579 part 2: 241861950
$
```
