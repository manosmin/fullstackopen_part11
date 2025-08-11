#!/bin/bash

echo "Build script"

cd phonebook-backend
npm install
npm run lint
cd ../phonebook-frontend
npm install
npm run lint
npm run build
