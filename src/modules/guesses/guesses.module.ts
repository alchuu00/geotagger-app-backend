import { Module } from '@nestjs/common';
import { GuessesController } from './guesses.controller';
import { GuessesService } from './guesses.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [GuessesController],
  providers: [GuessesService, PrismaService],
})
export class GuessesModule {}
