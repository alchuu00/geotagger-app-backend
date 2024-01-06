import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { GuessesService } from './guesses.service';
import { GetUserId } from 'src/decorators/user-id.decorator';
import { GuessType } from 'src/utils/types';
import { CreateGuessDto } from './dto/create-guess.dt';

@Controller('guesses')
@UseInterceptors(ClassSerializerInterceptor)
export class GuessesController {
  constructor(private guessesService: GuessesService) {}

  @Get('user/:userId')
  async getGuessesByUserId(
    @Param('userId') userId: string,
  ): Promise<GuessType[]> {
    console.log('userId', userId);
    return await this.guessesService.getGuessesByUserId(userId);
  }

  @Post(':locationId')
  async placeGuess(
    @Param('locationId') locationId: string,
    @Body() locationData: CreateGuessDto,
    @GetUserId() userId: string,
  ): Promise<GuessType> {
    console.log('location data', locationData);
    return await this.guessesService.placeGuess(
      locationId,
      locationData,
      userId,
    );
  }

  @Get(':locationId')
  async getGuessesByLocationId(
    @Param('locationId') locationId: string,
  ): Promise<GuessType[]> {
    return await this.guessesService.getGuessesByLocationId(locationId);
  }
}
