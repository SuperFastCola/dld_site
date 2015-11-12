#!/bin/sh

if [ ! -z "$1" ]; then
  if [ -e "$1" ] ; then
	aws s3api put-object --bucket portfolio.deluxeluxury.com --key $1 --body $1  --grant-read 'uri="http://acs.amazonaws.com/groups/global/AllUsers"'
else
	echo "file does not exist"
	fi
else
	echo "No arguments"
fi