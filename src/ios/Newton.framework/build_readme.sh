#!/bin/sh

header="Newton iOS SDK version $VCS_TAG"

echo "*$header*"
echo "---------------"

while read line; do
    echo "    $line"
done < $1

