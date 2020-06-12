#!/bin/bash
#
# This script takes the built assets in and deploys them to S3 for distribution
# via CloudFront. You have to set the AWS_BUCKET environment variable to
# indicate which bucket you want to deploy to.
#
# The actual deployment takes place via the AWS CLI. If it's not found in the
# path we attempt to install it.
#
BASEDIR=$(dirname $(dirname "${BASH_SOURCE[0]}"))

if [ -z "${AWS_BUCKET}" ]; then
	echo "AWS_BUCKET environment variable is not set."
	exit 1
fi

if ! [ -x "$(command -v aws)" ]; then
	if ! [ -x "$(command -v pip)" ]; then
		echo "The AWS CLI is not installed and pip is missing so it can't be installed."
		exit 1
	fi

	pip install --quiet awscli
fi

aws s3 sync ${BASEDIR}/_site/public s3://$AWS_BUCKET
