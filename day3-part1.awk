#!/usr/bin/env gawk -f
BEGIN {
  x = 0
}
{
  split($0, characters, "")
  charAt = characters[(x % length(characters)) + 1]
  if (charAt == "#") {
    trees++
  }
  x += 3
}

END {
  print "number of trees: " trees
}