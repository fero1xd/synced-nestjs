import { Module } from '@nestjs/common';
import { Services } from 'src/utils/constants';
import { FileManagerService } from './file-manager.service';

@Module({
  providers: [
    {
      provide: Services.FILE_MANAGER_SERVICE,
      useClass: FileManagerService,
    },
  ],
  exports: [
    {
      provide: Services.FILE_MANAGER_SERVICE,
      useClass: FileManagerService,
    },
  ],
})
export class FileManagerModule {}
