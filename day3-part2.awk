#!/usr/bin/env gawk -f

BEGIN {
  y = 0
  split("1, 3, 5, 7, 1", rights, ", ")
  split("1, 1, 1, 1, 2", downs, ", ")
}

{
  lines[l++] = $0
}

END {
  product = 1
  for (i in rights) {
    right = rights[i]
    down = downs[i]
    y = 0
    trees = 0

    for (j in lines) {
      split(lines[j], characters, "")

      x = (((y / down) * right) % length(characters)) + 1

      if (((y % down) == 0) && (characters[x] == "#")) {
        trees++
      }

      y++
    }

    product *= trees
  }

  print "product of trees: " product
}