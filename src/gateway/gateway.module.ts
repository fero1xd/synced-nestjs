import { Module } from '@nestjs/common';
import { Services } from 'src/utils/constants';
import { Gateway } from './gateway';
import { GatewaySessionManager } from './gateway.session';

@Module({
  providers: [
    Gateway,
    {
      provide: Services.GATEWAY_SESSION_MANAGER_SERVICE,
      useClass: GatewaySessionManager,
    },
  ],
})
export class GatewayModule {}
