import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LocationType } from 'src/utils/types';
import { CreateUpdateLocationDto } from './dto/create-update-location.dto';

@Injectable()
export class LocationsService {
  constructor(private prismaService: PrismaService) {}

  async getAllLocations(): Promise<LocationType[]> {
    return await this.prismaService.location.findMany();
  }

  async getLocationsByUser(userId: string): Promise<LocationType[]> {
    return await this.prismaService.location.findMany({
      where: { userId: userId },
    });
  }

  async getLocationById(locationId: string): Promise<LocationType> {
    return await this.prismaService.location.findUnique({
      where: { id: locationId },
    });
  }

  async createNewLocation(
    createUpdateLocationDto: CreateUpdateLocationDto,
    userId: string,
  ): Promise<LocationType> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    const newPoints = user.points + 10;

    await this.prismaService.user.update({
      where: { id: userId },
      data: { points: newPoints },
    });

    return await this.prismaService.location.create({
      data: {
        ...createUpdateLocationDto,
        userId: userId,
      },
    });
  }

  async updateLocation(
    locationId: string,
    createUpdateLocationDto: CreateUpdateLocationDto,
  ): Promise<LocationType> {
    return await this.prismaService.location.update({
      where: { id: locationId },
      data: { ...createUpdateLocationDto },
    });
  }

  async deleteLocation(locationId: string) {
    return this.prismaService.location.delete({
      where: { id: locationId },
    });
  }
}
