#!/bin/bash

INSTANCE=$(docker buildx create --use)
docker buildx build --platform linux/amd64,linux/arm64 --push -t presidenten/express-stress .
docker buildx rm $INSTANCE
