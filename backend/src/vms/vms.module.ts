import { Module } from '@nestjs/common';
import { RealtimeModule } from '../realtime/realtime.module';
import { VmsController } from './vms.controller';
import { VmsService } from './vms.service';

@Module({
  imports: [RealtimeModule],
  controllers: [VmsController],
  providers: [VmsService],
})
export class VmsModule {}
