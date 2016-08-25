#!/bin/sh
#change user,group and perms for multplie directoies

directorypattern="(css|javascript)"
filepattern="(html|json|pdf)"
excludeslash="\/"
bucket="superfastcola.com"
bucketfullpath="s3://$bucket/"
uploadfrom=${PWD} #can put an entire path here - right now set to current working directory	

if [ -d "$uploadfrom" ]; then
	for i in `ls -al $uploadfrom`; do

		if [[ -f $i && "$i" =~ $filepattern ]]; then
			aws s3 cp $uploadfrom/$i $bucketfullpath$i \
			--exclude "*package.json"
	 	fi
		
		if [[ "$i" =~ $directorypattern && -d $i ]]; then
			aws s3 cp $uploadfrom/$i $bucketfullpath$i --recursive \
			--exclude "*.DS*" \
			--exclude "*sublime*" \
			--exclude "data-uri/*" \
			--exclude "*package.json" \
			--exclude "bourbon/*" \
			--exclude "neat/*" \
			--exclude "src/*" \
			--exclude "scss/*"
	 	fi
	done
	
	#set read permissions for all files
	for i in `aws s3api list-objects --bucket $bucket --query 'Contents[].{Key: Key}'`; do		

		if [[ -n $filepattern && "$i" =~ $filepattern && ! "$i" =~ $excludeslash ]]; then
			file=${i%\"} #strips quote from end
	 		file=${file#\"} # strips quote from beginning
	 		echo "Setting $file to public"
			aws s3api put-object-acl --bucket $bucket --key $file --grant-read 'uri="http://acs.amazonaws.com/groups/global/AllUsers"'
	 	fi

	 	if [[ $i =~ $directorypattern\/ ]]; then
	 		file=${i%\"} #strips quote from end
	 		file=${file#\"} # strips quote from beginning
	 		echo "Setting $file to public"
	 		aws s3api put-object-acl --bucket $bucket --key $file --grant-read 'uri="http://acs.amazonaws.com/groups/global/AllUsers"'
	 	fi
	done
else
	echo "$1 is not a directory"
fi