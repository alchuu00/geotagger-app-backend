import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async validateUser(details: any) {
    console.log('AuthService');
    console.log(details);
    const user = await this.prismaService.user.findUnique({
      where: { email: details.email },
    });
    console.log('user', user);
    if (user) return user;
    console.log('user not found!');
    const newUser = this.prismaService.user.create({ data: details });
    return newUser;
  }

  async findUser(id: string) {
    console.log('find id', id);
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    return user;
  }
}
