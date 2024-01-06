import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGuessDto } from './dto/create-guess.dt';
import { GuessType } from 'src/utils/types';
import { getDistance } from 'geolib';

@Injectable()
export class GuessesService {
  constructor(private prismaService: PrismaService) {}

  async getGuessesByLocationId(locationId: string): Promise<GuessType[]> {
    return await this.prismaService.guess.findMany({
      where: { locationId: locationId },
    });
  }

  async getGuessesByUserId(userId: string): Promise<GuessType[]> {
    console.log('userId', userId);
    return await this.prismaService.guess.findMany({
      where: { userId: userId },
    });
  }

  async placeGuess(
    locationId: string,
    locationData: CreateGuessDto,
    userId: string,
  ): Promise<GuessType> {
    // get the number of guesses that user has for specific location
    const guesses = await this.prismaService.guess.findMany({
      where: {
        userId: userId,
        locationId: locationId,
      },
    });

    // get the specific location and calculate difference in distance
    const location = await this.prismaService.location.findUnique({
      where: { id: locationId },
    });

    const realLocation = {
      latitude: location.latitude,
      longitude: location.longitude,
    };

    const guessedLocation = {
      latitude: locationData.latitude,
      longitude: locationData.longitude,
    };

    // the function returns difference in meters
    const difference = getDistance(realLocation, guessedLocation);

    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    console.log('user', user);

    // Calculate points if the distance was equal or less than 10km
    if (difference <= 10000) {
      user.points = user.points + 1;
    } else {
      user.points = user.points;
    }

    // update user with new points
    await this.prismaService.user.update({
      where: { id: userId },
      data: { points: user.points, ...user },
    });

    return await this.prismaService.guess.create({
      data: {
        difference: difference,
        order: guesses.length + 1,
        userId: userId,
        locationId: locationId,
      },
    });
  }
}
