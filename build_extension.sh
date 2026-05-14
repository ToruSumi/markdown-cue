#! /bin/bash

echo "Building the extension..."
npm install
npm run compile
npm test

echo "Packing the extension..."
npx @vscode/vsce package

echo "Extension built and packaged successfully."

echo "Installing the extension..."
code --install-extension *.vsix
echo "Extension installed successfully."