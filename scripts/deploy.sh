#!/bin/bash

APP_NAME=najarang-front
STAGE_BUCKET_NAME=najarang-front-dev
PROD_BUCKET_NAME=najarang-front
IS_GITHUB=false

if [[ "$1" != "" ]]; then
    DEPLOY="$1"
else
    echo 'ERROR: Failed to supply environment name'
    exit 1
fi

if [[ "$2" != "" ]]; then
    IS_GITHUB=true
fi

# sync data to AWS S3
if [ "$IS_GITHUB" = true ] ; then
    if [ "$DEPLOY" = "stage" ] ; then
        echo 'deploy stage on github'
    else
        echo 'deploy prod on github'
        aws s3 sync ./build s3://${PROD_BUCKET_NAME}
    fi
else
    if [ "$DEPLOY" = "stage" ] ; then
        echo 'deploy stage on local'
    else
        echo 'deploy prod on local'
    fi
fi
