import fs from 'fs';
import path from 'path';

const FILE_NAME = 'package.json';
const pathToFile = path.resolve(FILE_NAME);
const packageJson = JSON.parse(fs.readFileSync(pathToFile, 'utf8'));

const minimalPackageJSON = {
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  main: 'dist/index.js',
  types: 'dist/index.d.js',
  exports: packageJson.exports,
  keywords: packageJson.keywords,
  author: packageJson.author,
  license: packageJson.license,
  dependencies: packageJson.dependencies,
  engines: packageJson.engines,
};

fs.writeFileSync(pathToFile, JSON.stringify(packageJson, null, 2));
console.log('packageJson updated');
