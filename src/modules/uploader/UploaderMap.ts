import { UploaderAbstract } from './UploaderAbstract.js';
import { FilePathType } from '../../shared/types/file-path.type';

export class UploaderMap extends UploaderAbstract {
  upload(data: Map<string, any>[], filePath: FilePathType) {
    const plainObject = this.convertMapToObject(data);
    const dataString = this.formatToJSON(plainObject);
    this.uploadToFile(filePath, dataString);
  }

  private convertMapToObject(data: Map<string, any>[]) {
    if (Array.isArray(data) && data.every((item) => item instanceof Map)) {
      return data.map((item) => {
        return Object.fromEntries(item);
      });
    } else {
      return [];
    }
  }
}
