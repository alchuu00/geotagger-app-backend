import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserType } from 'src/utils/types';
import Logging from 'src/library/Logging';
import { UpdateUserDto } from './dto/update-user.dto';
import { compareHash, hash } from 'src/utils/bcrypt';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async getAllUsers(): Promise<UserType[]> {
    try {
      return this.prismaService.user.findMany();
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        'Something went wrong while searching for a list of users.',
      );
    }
  }

  async getUserById(id: string): Promise<UserType> {
    try {
      const user = this.prismaService.user.findUnique({ where: { id: id } });
      if (!user) {
        throw new BadRequestException(`Cannot find user with id: ${id}`);
      }
      return user;
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        `Something went wrong while searching for a user with id: ${id}.`,
      );
    }
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserType> {
    const user = await this.getUserById(id);
    const { email, password, confirm_password, ...data } = updateUserDto;

    if (user.email !== email && email) {
      user.email = email;
    }
    if (user.password && confirm_password) {
      if (password !== confirm_password) {
        throw new BadRequestException('Passwords do not match.');
      }
      if (await compareHash(password, user.password)) {
        throw new BadRequestException(
          'New password cannot be the same as your old password.',
        );
      }
      user.password = await hash(password, 10);
    }
    try {
      Object.entries(data).map((entry) => {
        user[entry[0]] = entry[1];
      });
      return this.prismaService.user.update({
        where: { id: user.id },
        data: {
          email: email,
          password: password,
          confirm_password: confirm_password,
          ...data,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong while updating the user.',
      );
    }
  }

  async deleteUser(id: string): Promise<UserType> {
    return this.prismaService.user.delete({ where: { id: id } });
  }
}
