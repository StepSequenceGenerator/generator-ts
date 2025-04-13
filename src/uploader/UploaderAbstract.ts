import fs from 'fs';
import { FilePathType } from '../shared/types/file-path-type.js';

export abstract class UploaderAbstract {
  protected uploadToFile(filePath: FilePathType, content: string) {
    fs.writeFileSync(filePath, content, 'utf8');
  }

  protected formatToJSON(data: any): string {
    return JSON.stringify(data, null, 2);
  }

  abstract upload(data: any, filePath: FilePathType): void;
}
