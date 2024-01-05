import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { LocationType } from 'src/utils/types';
import { LocationsService } from './locations.service';
import { CreateUpdateLocationDto } from './dto/create-update-location.dto';
import { GetUserId } from 'src/decorators/user-id.decorator';
import { RequestWithUser } from 'src/interfaces/auth.interface';

@Controller('locations')
@UseInterceptors(ClassSerializerInterceptor)
export class LocationsController {
  constructor(private locationsService: LocationsService) {}

  @Get()
  async getAllLocations(): Promise<LocationType[]> {
    return this.locationsService.getAllLocations();
  }

  @Get(':userId')
  async getLocationsByUser(
    @Param('userId') userId: string,
  ): Promise<LocationType[]> {
    return this.locationsService.getLocationsByUser(userId);
  }

  @Get(':locationId')
  async getLocationById(
    @Param('locationId') locationId: string,
  ): Promise<LocationType> {
    return this.locationsService.getLocationById(locationId);
  }

  @Post()
  async createNewLocation(
    @Body() createUpdateLocationDto: CreateUpdateLocationDto,
    @Req() req: RequestWithUser,
    @GetUserId() userId: string,
  ): Promise<LocationType> {
    console.log('req.user', req.user);
    return this.locationsService.createNewLocation(
      createUpdateLocationDto,
      userId,
    );
  }

  @Patch(':locationId')
  async updateLocation(
    @Param('locationId') locationId: string,
    @Body() createUpdateLocationDto: CreateUpdateLocationDto,
  ): Promise<LocationType> {
    return this.locationsService.updateLocation(
      locationId,
      createUpdateLocationDto,
    );
  }

  @Delete(':locationId')
  async deleteLocation(
    @Param('locationId') locationId: string,
  ): Promise<LocationType> {
    return this.locationsService.deleteLocation(locationId);
  }
}
