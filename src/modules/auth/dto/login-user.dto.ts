import { IsNotEmpty, IsEmail, Length, Matches } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(6, 50)
  @Matches(/^(?=.*[0-9])/)
  password: string;
}
