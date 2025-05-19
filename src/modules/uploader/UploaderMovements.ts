import { UploaderAbstract } from './UploaderAbstract.js';
import { Movement } from '../movement/Movement.js';
import {
  Edge,
  Leg,
  MovementCharacter,
  RotationDegree,
  RotationDirection,
  TransitionDirection,
} from '../../shared/enums/movement-enums.js';
import { TurnAbsoluteName } from '../../shared/enums/turn-absolute-name.enum';

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
  type: {
    obj: MovementCharacter,
    name: 'MovementCharacter',
  },
  absoluteName: {
    obj: TurnAbsoluteName,
    name: 'TurnAbsoluteName',
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
      `import { Movement } from '${importPath}/movement/Movement.js';\n` +
      `import { Leg, Edge, RotationDirection, RotationDegree, TransitionDirection, MovementCharacter } from '${importPath}/enums/movement-enums.js';\n\n` +
      `export const movements: Movement[] = `;
    return `${imports} ${formatedData};\n`;
  }
}
