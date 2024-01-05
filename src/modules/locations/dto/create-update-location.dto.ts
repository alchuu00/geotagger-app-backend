import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUpdateLocationDto {
  @IsNotEmpty()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsString()
  longitude: string;

  @IsNotEmpty()
  @IsString()
  latitude: string;
}
