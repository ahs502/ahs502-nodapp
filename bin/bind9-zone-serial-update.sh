#!/bin/bash

ZONES_PATH="/etc/bind/zones"
DATE=$(date +%Y%m%d)
# we're looking line containing this comment
NEEDLE="Serial"

if [ -e "${ZONES_PATH}/SerialNumber" ]; then
  curr=$(cat ${ZONES_PATH}/SerialNumber)
  curr=${curr:-0}
else
  curr=0
fi
# replace if current date is shorter (possibly using different format)
if [ ${#curr} -lt ${#DATE} ]; then
  serial="${DATE}00"
else
  prefix=${curr::-2}
  if [ "$DATE" -eq "$prefix" ]; then # same day
    num=${curr: -2} # last two digits from serial number
    num=$((10#$num + 1)) # force decimal representation, increment
    serial="${DATE}$(printf '%02d' $num )" # format for 2 digits
  else
    serial="${DATE}00" # just update date
  fi
fi
echo $serial > "${ZONES_PATH}/SerialNumber"

for ZONE in $(ls -1 $ZONES_PATH) ; do
  if [ "$ZONE" != "SerialNumber" ]; then
  
    # curr=$(/bin/grep -e "${NEEDLE}$" $ZONES_PATH/${ZONE} | /bin/sed -n "s/^\s*\([0-9]*\)\s*;\s*${NEEDLE}\s*/\1/p")
    
    /bin/sed -i -e "s/^\(\s*\)[0-9]\{0,\}\(\s*;\s*${NEEDLE}\)$/\1${serial}\2/" ${ZONES_PATH}/${ZONE}
    echo "${ZONE}: "
    grep "; ${NEEDLE}$" $ZONES_PATH/${ZONE}
  
  fi
done

