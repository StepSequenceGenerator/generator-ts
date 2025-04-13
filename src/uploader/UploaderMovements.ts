import { UploaderAbstract } from './UploaderAbstract.js';
import { Movement } from '../classes/Movement.js';
import {
  Edge,
  Leg,
  RotationDegree,
  RotationDirection,
  TransitionDirection,
} from '../enums/movement-enums.js';

const enumMap: Record<string, any> = {
  transitionDirection: {
    obj: TransitionDirection,
    name: 'TransitionDirection',
  },
  rotationDirection: {
    obj: RotationDirection,
    name: 'RotationDirection',
  },
  rotationDegree: {
    obj: RotationDegree,
    name: 'RotationDegree',
  },
  startLeg: {
    obj: Leg,
    name: 'Leg',
  },
  endLeg: {
    obj: Leg,
    name: 'Leg',
  },
  startEdge: {
    obj: Edge,
    name: 'Edge',
  },
  endEdge: {
    obj: Edge,
    name: 'Edge',
  },
};

export class UploaderMovements extends UploaderAbstract {
  upload(data: Movement[], filePath: string): void {
    const formatedData = this.formatData(data);
    const importPath = this.getImportPath(filePath);
    const content = this.addImports(importPath, formatedData);
    this.uploadToFile(filePath, content);
  }

  private formatData(data: Movement[]): string {
    const dataString = this.formatToJSON(data);
    return this.formatEnum(dataString, enumMap);
  }

  private formatEnum(data: string, enumMap: Record<string, any>): string {
    let formatedData: string = data;

    for (const [enumKey, enumInfo] of Object.entries(enumMap)) {
      const pattern = new RegExp(`("${enumKey}").+?(\\d+)`, 'g');
      formatedData = formatedData.replace(pattern, (_, name, value) => {
        const enumName = enumInfo.name;
        const enumValue = enumInfo.obj[Number(value)];
        return `${enumKey}: ${enumName}.${enumValue}`;
      });
    }
    return formatedData;
  }

  private getImportPath(filePath: string): string {
    const pattern = /\/(public\/.*)/;
    const replaceString = '/src';
    return filePath.replace(pattern, replaceString);
  }

  private addImports(importPath: string, formatedData: string) {
    const imports =
      `import { Movement } from '${importPath}/classes/Movement.js';\n` +
      `import { Leg, Edge, RotationDirection, RotationDegree, TransitionDirection } from '${importPath}/enums/movement-enums.js';\n\n` +
      `export const movements: Movement[] = `;
    return `${imports} ${formatedData};\n`;
  }
}
