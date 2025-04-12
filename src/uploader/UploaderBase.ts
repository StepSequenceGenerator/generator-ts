import { UploaderAbstract } from './UploaderAbstract.js';

export class UploaderBase extends UploaderAbstract {
  upload(data: any, filePath: string) {
    const dataString = this.formatToJSON(data);
    this.formatToJSON(dataString);
  }
}
