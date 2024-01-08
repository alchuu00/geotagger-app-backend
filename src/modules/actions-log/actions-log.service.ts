import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActionLogDto } from './dto/actions-log.dto';

@Injectable()
export class ActionsLogService {
  constructor(private prismaService: PrismaService) {}
  async logActivity(activity: ActionLogDto, userId: string) {
    return this.prismaService.actionLog.create({
      data: {
        action: activity.action,
        new_value: activity.new_value,
        component_type: activity.component_type,
        userId: userId,
      },
    });
  }
}
