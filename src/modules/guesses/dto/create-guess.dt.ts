import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGuessDto {
  @IsNotEmpty()
  @IsString()
  longitude: string;

  @IsNotEmpty()
  @IsString()
  latitude: string;
}
