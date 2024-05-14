#!/bin/bash

set -e

echo "Building backend..."
npm install
npm run build
cp -rfv dist/ rpi-power-control
cp -v package.json rpi-power-control
cp -v package-lock.json rpi-power-control
cp -v .env rpi-power-control

echo "Building frontend..."
cd frontend
npm install
npm run build
cp -rfv dist/frontend/browser/* ../rpi-power-control/app

echo "Downloading production dependencies..."
cd ../rpi-power-control
npm install --omit=dev

echo "Packaging..."
cd ..
tar -cvf rpi-power-control.tar rpi-power-control/
