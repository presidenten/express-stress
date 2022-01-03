#!/bin/bash

VERSION=$1

if [[ -z $VERSION ]]; then
  echo "Usage: $0 <version>"
  echo "Example: $0 1.0.0"
  exit 1
fi

INSTANCE=$(docker buildx create --use)
docker buildx build --platform linux/amd64,linux/arm64 --push -t presidenten/express-stress .
docker buildx build --platform linux/amd64,linux/arm64 --push -t presidenten/express-stress:$VERSION .
docker buildx rm $INSTANCE
