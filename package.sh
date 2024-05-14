#!/bin/bash

set -e

npm run install --omit=dev
npm run build
cp -rfv dist/ rpi-power-control
cp -v package.json rpi-power-control
cp -v package-lock.json rpi-power-control
cp -v .env rpi-power-control

cd frontend
npm run install --omit=dev
npm run build
cp -rfv dist/frontend/browser/* ../rpi-power-control/app

cd ..
tar -cvf rpi-power-control.tar rpi-power-control/
