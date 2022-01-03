#!/bin/bash

VERSION=$1

if [[ -z $VERSION ]]; then
  echo "Usage: $0 <version>"
  echo "Example: $0 1.0.0"
  exit 1
fi

docker image build -t express-stress .
docker image tag express-stress presidenten/express-stress
docker image tag presidenten/express-stress presidenten/express-stress:$VERSION
