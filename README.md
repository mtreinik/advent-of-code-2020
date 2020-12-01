# advent-of-code-2020
My participation to Advent of Code 2020

## Day 1: Report Repair

Algorithm: 
1. sort input entries in ascending order
1. point `small` to first element and `large` to last element of sorted list
1. if `small + large` is less than 2020, move `small` to next element
1. if `small + large` is greater than 2020, move `large` to previous element
1. if `small + large` equals 2020, return `small * large`
1. if `small` and `large` point to the same element, the algorithm has failed
