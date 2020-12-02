#!/usr/bin/env gawk -f

{
  split($1, limits, "-")
  gsub(/:/, "", $2)
  len = split($3, characters, $2) - 1
  if (limits[1] <= len && len <= limits[2]) {
    valid++
  }
}

END {
  print "valid passwords: " valid
}