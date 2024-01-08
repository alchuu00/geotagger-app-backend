import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ActionsLogService } from './actions-log.service';
import { GetUserId } from 'src/decorators/user-id.decorator';
import { ActionLogDto } from './dto/actions-log.dto';

@Controller('actions-log')
@UseInterceptors(ClassSerializerInterceptor)
export class ActionsLogController {
  constructor(private actionsLogService: ActionsLogService) {}

  @Post()
  logActivity(@Body() activity: ActionLogDto, @GetUserId() userId: string) {
    return this.actionsLogService.logActivity(activity, userId);
  }
}
