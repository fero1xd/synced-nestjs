import { Module } from '@nestjs/common';
import { Services } from 'src/utils/constants';
import { HashingService } from './hashing.service';

@Module({
  providers: [
    {
      provide: Services.HASHING_SERVICE,
      useClass: HashingService,
    },
  ],
  exports: [
    {
      provide: Services.HASHING_SERVICE,
      useClass: HashingService,
    },
  ],
})
export class HashingModule {}
