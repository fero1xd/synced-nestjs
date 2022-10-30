import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { AvailableLanguages } from 'src/utils/enums';

@Injectable()
export class Runner {
  async run(path: string, language: AvailableLanguages) {
    return await new Promise((res, rej) => {
      let cmd = '';
      if (language === AvailableLanguages.JAVASCRIPT) {
        cmd = `node ${path}`;
      } else if (language === AvailableLanguages.PYTHON) {
        cmd = `python ${path}`;
      } else if (language === AvailableLanguages.JAVA) {
        cmd = `java ${path}`;
      }
      exec(cmd, { timeout: 10000 }, (err, stdout, stderr) => {
        err && rej({ error: stderr });
        stderr && rej({ error: stderr });

        res({ output: stdout });
      });
    });
  }
}
