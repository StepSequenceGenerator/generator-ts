import fs from 'fs';

export abstract class UploaderAbstract {
  protected uploadToFile(filePath: string, content: string) {
    fs.writeFileSync(filePath, content, 'utf8');
  }

  protected formatToJSON(data: any): string {
    return JSON.stringify(data, null, 2);
  }

  abstract upload(data: any, filePath: string): void;
}
