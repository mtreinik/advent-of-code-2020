#!/usr/bin/env gawk -f

{
  split($1, limits, "-")
  split($2, characterToFind, ":")
  split($3, characters, "")
  count = 0
  for (i in characters) {
    if (characters[i] == characterToFind[1]) {
      count++
    }
  }
  if (limits[1] <= count && count <= limits[2]) {
    valid++
  }
}

END {
  print "valid passwords: " valid
}