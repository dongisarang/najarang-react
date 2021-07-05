#!/bin/bash

APP_NAME=najarang-front
STAGE_BUCKET_NAME=najarang-front-dev
PROD_BUCKET_NAME=najarang-front
IS_GITHUB=false
# PROD_DISTRIBUTION_ID= xxx

if [[ "$1" != "" ]]; then
    DEPLOY="$1"
else
    echo 'ERROR: Failed to supply environment name'
    exit 1
fi

if [[ "$2" != "" ]]; then
    IS_GITHUB=true
fi

# delete origin js, css files
while IFS= read -r file; do rm ${file}; done < <(find dist/${APP_NAME}/ -type f -name "*.{js|css}")
# rename gzip files to remove .gz extension
while IFS= read -r file; do mv $file ${file%.gz}; done < <(find dist/${APP_NAME}/ -type f -name "*.gz")

# sync data to AWS S3
if [ "$IS_GITHUB" = true ] ; then
    if [ "$DEPLOY" = "stage" ] ; then
        echo 'deploy stage on github'
        aws s3 sync dist/${APP_NAME} s3://${STAGE_BUCKET_NAME} --metadata-directive REPLACE --acl public-read --exclude "index.html" --exclude "*.css" --exclude "*.js" --region ap-northeast-2 || { echo 'ERROR: s3 sync failed' ; exit 1; }
        aws s3 sync dist/${APP_NAME} s3://${STAGE_BUCKET_NAME} --metadata-directive REPLACE --acl public-read --exclude "*" --include "assets/*" --region ap-northeast-2 || { echo 'ERROR: s3 js/css sync failed' ; exit 1; }
        aws s3 sync dist/${APP_NAME} s3://${STAGE_BUCKET_NAME} --metadata-directive REPLACE --acl public-read --exclude "*" --exclude "assets/*" --include "*.css" --include "*.js" --content-encoding gzip --region ap-northeast-2 || { echo 'ERROR: s3 js/css sync failed' ; exit 1; }
        aws s3 cp dist/${APP_NAME}/index.html s3://${STAGE_BUCKET_NAME}/index.html --metadata-directive REPLACE --cache-control max-age=0,no-cache,no-store,must-revalidate --content-type text/html --acl public-read --region ap-northeast-2  || { echo 'ERROR: s3 cp index failed' ; exit 1; }
    else
        echo 'deploy prod on github'
        aws s3 sync dist/${APP_NAME} s3://${PROD_BUCKET_NAME} --metadata-directive REPLACE --acl public-read --exclude "index.html" --exclude "*.css" --exclude "*.js" --region ap-northeast-2 || { echo 'ERROR: s3 sync failed' ; exit 1; }
        aws s3 sync dist/${APP_NAME} s3://${PROD_BUCKET_NAME} --metadata-directive REPLACE --acl public-read --exclude "*" --include "assets/*" --region ap-northeast-2 || { echo 'ERROR: s3 js/css sync failed' ; exit 1; }
        aws s3 sync dist/${APP_NAME} s3://${PROD_BUCKET_NAME} --metadata-directive REPLACE --acl public-read --exclude "*" --exclude "assets/*" --include "*.css" --include "*.js" --content-encoding gzip --region ap-northeast-2 || { echo 'ERROR: s3 js/css sync failed' ; exit 1; }
        aws s3 cp dist/${APP_NAME}/index.html s3://${PROD_BUCKET_NAME}/index.html --metadata-directive REPLACE --cache-control max-age=0,no-cache,no-store,must-revalidate --content-type text/html --acl public-read --region ap-northeast-2 || { echo 'ERROR: s3 cp index failed' ; exit 1; }
#         aws cloudfront create-invalidation --distribution-id ${PROD_DISTRIBUTION_ID} --paths '/*'
    fi
else
    if [ "$DEPLOY" = "stage" ] ; then
        echo 'deploy stage on local'
        aws s3 --profile lemon sync dist/${APP_NAME} s3://${STAGE_BUCKET_NAME} --metadata-directive REPLACE --acl public-read --exclude "index.html" --exclude "*.css" --exclude "*.js" || { echo 'ERROR: s3 sync failed' ; exit 1; }
        aws s3 --profile lemon sync dist/${APP_NAME} s3://${STAGE_BUCKET_NAME} --metadata-directive REPLACE --acl public-read --exclude "*" --include "assets/*" || { echo 'ERROR: s3 js/css sync failed' ; exit 1; }
        aws s3 --profile lemon sync dist/${APP_NAME} s3://${STAGE_BUCKET_NAME} --metadata-directive REPLACE --acl public-read --exclude "*" --exclude "assets/*" --include "*.css" --include "*.js" --content-encoding gzip || { echo 'ERROR: s3 js/css sync failed' ; exit 1; }
        aws s3 --profile lemon cp dist/${APP_NAME}/index.html s3://${STAGE_BUCKET_NAME}/index.html --metadata-directive REPLACE --cache-control max-age=0,no-cache,no-store,must-revalidate --content-type text/html --acl public-read || { echo 'ERROR: s3 cp index failed' ; exit 1; }
    else
        echo 'deploy prod on local'
        aws s3 --profile lemon sync dist/${APP_NAME} s3://${PROD_BUCKET_NAME} --metadata-directive REPLACE --acl public-read --exclude "index.html" --exclude "*.css" --exclude "*.js" || { echo 'ERROR: s3 sync failed' ; exit 1; }
        aws s3 --profile lemon sync dist/${APP_NAME} s3://${PROD_BUCKET_NAME} --metadata-directive REPLACE --acl public-read --exclude "*" --include "assets/*" || { echo 'ERROR: s3 js/css sync failed' ; exit 1; }
        aws s3 --profile lemon sync dist/${APP_NAME} s3://${PROD_BUCKET_NAME} --metadata-directive REPLACE --acl public-read --exclude "*" --exclude "assets/*" --include "*.css" --include "*.js" --content-encoding gzip || { echo 'ERROR: s3 js/css sync failed' ; exit 1; }
        aws s3 --profile lemon cp dist/${APP_NAME}/index.html s3://${PROD_BUCKET_NAME}/index.html --metadata-directive REPLACE --cache-control max-age=0,no-cache,no-store,must-revalidate --content-type text/html --acl public-read || { echo 'ERROR: s3 cp index failed' ; exit 1; }
#         aws cloudfront create-invalidation --distribution-id ${PROD_DISTRIBUTION_ID} --paths '/*'
    fi
fi
