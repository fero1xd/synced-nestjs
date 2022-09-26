import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';

@Injectable()
export class PythonRunner {
  async run(path: string) {
    return await new Promise((res, rej) => {
      exec(`python ${path}`, (err, stdout, stderr) => {
        err && rej({ error: stderr });
        stderr && rej({ error: stderr });

        res({ output: stdout });
      });
    });
  }
}
