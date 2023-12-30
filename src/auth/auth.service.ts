import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  // Validates a user by email. If the user exists, returns the user. If not, creates a new user with the provided details.
  async validateUser(details: any) {
    const user = await this.prismaService.user.findUnique({
      where: { email: details.email },
    });
    if (user) return user;
    const newUser = this.prismaService.user.create({ data: details });
    return newUser;
  }

  // Finds and returns a user from the database by their ID
  async findUser(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    return user;
  }
}
