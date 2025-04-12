import { UploaderAbstract } from './UploaderAbstract.js';
import { Movement } from '../classes/Movement.js';

export class UploaderMovements extends UploaderAbstract {
  constructor(data: Movement[]) {
    super(data);
  }

  upload(filePath: string): void {
    const formatedData = this.formatData();
    const importPath = this.getImportPath(filePath);
    const content = this.addImports(importPath, formatedData);
    this.uploadToFile(filePath, content);
  }

  private formatData() {
    const pattern = /("transitionDirection").+(\d),/g;
    const dataString = JSON.stringify(this.data, null, 2);
    const matches = dataString.match(pattern);
    if (matches) {
      for (const item of matches) {
        console.log(Object.keys(item));
      }
    }
    return JSON.stringify(this.data, null, 2).replace(
      /("transitionDirection").+(\d),/g,
      `$1: TransitionDirection.,`
    );
  }

  private getImportPath(filePath: string): string {
    const pattern = /\/(public\/.*)/;
    const replaceString = '/src';
    return filePath.replace(pattern, replaceString);
  }

  private addImports(importPath: string, formatedData: string) {
    const imports =
      `import { Movement } from '${importPath}/classes/Movement.js';\n` +
      `import { Leg, Edge, RotationDirection, RotationDegrees, TransitionDirection } from '${importPath}/enums/movement-enums.js';\n\n` +
      `export const movements: Movement[] = `;
    return `${imports} ${formatedData};\n`;
  }
}
