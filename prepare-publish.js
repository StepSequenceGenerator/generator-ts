import fs from 'fs';
import path from 'path';

const FILE_NAME = 'package.json';
const pathToFile = path.resolve(FILE_NAME);
const pathToPublish = path.resolve('dist/package.json');
const packageJson = JSON.parse(fs.readFileSync(pathToFile, 'utf8'));

const minimalPackageJSON = {
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  main: 'dist/index.js',
  types: packageJson.types,
  exports: packageJson.exports,
  keywords: packageJson.keywords,
  author: packageJson.author,
  license: packageJson.license,
  dependencies: packageJson.dependencies,
  engines: packageJson.engines,
};

fs.writeFileSync(pathToPublish, JSON.stringify(minimalPackageJSON, null, 2));
console.log('packageJson updated');
