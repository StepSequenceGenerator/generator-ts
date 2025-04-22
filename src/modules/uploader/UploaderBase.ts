import { UploaderAbstract } from './UploaderAbstract.js';
import { FilePathType } from '../../shared/types/file-path-type.js';

export class UploaderBase extends UploaderAbstract {
  upload(data: any, filePath: FilePathType) {
    const dataString = this.formatToJSON(data);
    this.formatToJSON(dataString);
    this.uploadToFile(filePath, dataString);
  }
}
