#!/bin/bash

echo "Build script"

cd phonebook-backend
npm install
cd ../phonebook-frontend
npm install
npm run build
