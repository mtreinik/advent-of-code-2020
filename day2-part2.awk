#!/usr/bin/env gawk -f

{
  split($1, limits, "-")
  gsub(/:/, "", $2)
  characterToFind = $2
  split($3, characters, "")
  count = 0
  for (i = 1; i <= 2; i++) {
    if (characters[limits[i]] == characterToFind) {
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