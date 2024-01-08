import { Module } from '@nestjs/common';
import { ActionsLogService } from './actions-log.service';
import { ActionsLogController } from './actions-log.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [ActionsLogService, PrismaService],
  controllers: [ActionsLogController],
})
export class ActionsLogModule {}
