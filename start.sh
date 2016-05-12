#!/bin/sh

cd web/
REDIS=localhost npm start &
cd ../

cd stock_fetch/
REDIS=localhost npm start &
cd ../
