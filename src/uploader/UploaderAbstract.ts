import fs from 'fs';

export abstract class UploaderAbstract {
  protected data: any;
  constructor(data: any) {
    this.data = data;
  }

  protected uploadToFile(filePath: string, content: string) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
  abstract upload(filePath: string): void;
}
