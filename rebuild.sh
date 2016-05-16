#!/bin/bash

docker-compose stop
docker-compose rm --force
docker-compose up -d --build
