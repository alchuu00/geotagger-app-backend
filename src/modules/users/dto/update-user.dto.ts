import {
  IsNotEmpty,
  IsEmail,
  Length,
  Matches,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  first_name: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  last_name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  avatar: string;

  // password must contain at least one digit
  @IsNotEmpty()
  @Length(6, 50)
  @Matches(/^(?=.*[0-9])/)
  password: string;

  @IsNotEmpty()
  @Length(6, 50)
  @Matches(/^(?=.*[0-9])/)
  confirm_password: string;
}
