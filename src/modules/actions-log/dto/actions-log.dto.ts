import { IsString } from 'class-validator';

export class ActionLogDto {
  @IsString()
  action: string;

  @IsString()
  new_value: string;

  @IsString()
  component_type: string;
}
