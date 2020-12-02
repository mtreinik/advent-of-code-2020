#!/usr/bin/env gawk -f

{
  split($1, limits, "-")
  split($2, characterToFind, ":")
  split($3, characters, "")
  count = 0
  for (i in characters) {
    if (characters[i] == characterToFind[1] && (i == limits[1] || i == limits[2])) {
      count++
    }
  }
  if (count == 1) {
    valid++
  }
}

END {
  print "valid passwords: " valid
}