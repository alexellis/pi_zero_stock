#!/bin/bash

# Build first - before bringing site down.
docker-compose build

docker-compose down
docker-compose up -d
