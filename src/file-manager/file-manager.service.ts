import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { join } from 'path';
import { GenerateFileParams } from 'src/utils/types';
import { v4 as uuid } from 'uuid';
import { createWriteStream } from 'fs';

@Injectable()
export class FileManagerService {
  generateFile(params: GenerateFileParams) {
    return new Promise<string>((res, rej) => {
      const { extension, code } = params;

      const fileId = uuid();
      const fileName = `${fileId}.${extension}`;

      const filePath = join(process.env.CODES_DIRECTORY, fileName);

      // await writeFileSync(filePath, code);

      const stream = createWriteStream(filePath);

      stream.write(code, () => res(filePath));

      stream.on('error', () => {
        throw new InternalServerErrorException('Writing failed');
      });
    });
  }
}
