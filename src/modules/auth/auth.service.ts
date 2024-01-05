import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import Logging from 'src/library/Logging';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { compareHash, hash } from 'src/utils/bcrypt';
import { UserType } from 'src/utils/types';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUserGoogle(data: RegisterUserDto) {
    Logging.info('Validating user...');
    const user = await this.prismaService.user.findUnique({
      where: { email: data.email },
    });
    if (user) return user;
    const newUser = await this.prismaService.user.create({
      data: {
        ...data,
        role: 'user',
        points: 10,
      },
    });
    return newUser;
  }

  async validateUser(email: string, password: string): Promise<UserType> {
    Logging.info('Validating user...');
    const user = await this.prismaService.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      throw new BadRequestException('Invalid credentials.');
    }
    if (!(await compareHash(password, user.password))) {
      throw new BadRequestException('Invalid credentials.');
    }
    Logging.info('User is valid.');
    return user;
  }

  async register(registerUserDto: RegisterUserDto): Promise<UserType> {
    const hashedPassword: string = await hash(registerUserDto.password, 10);
    const user = await this.prismaService.user.create({
      data: {
        ...registerUserDto,
        password: hashedPassword,
        confirm_password: hashedPassword,
        role: 'user',
        points: 10,
      },
    });
    return user;
  }

  async generateJwt(user: UserType): Promise<string> {
    return this.jwtService.sign({ sub: user.id, name: user.email });
  }

  async getCurrentUser(cookie: string): Promise<UserType> {
    const data = await this.jwtService.verifyAsync(cookie);
    const user = await this.prismaService.user.findUnique({
      where: { id: data['sub'] },
    });
    return user;
  }

  async refreshToken(refreshToken: string): Promise<string> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const accessToken = this.generateJwt(payload.sub);
      return accessToken;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token.');
    }
  }

  async findUser(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    return user;
  }
}
