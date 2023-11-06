import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from 'src/prisma/prisma.service';
import { ErrorException } from 'src/error/error.exception';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async create(user: Prisma.UserUncheckedCreateInput) {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
      const newUser = await this.prisma.user.create({
        data: user,
      });
      return newUser;
    } catch (error) {
      throw new ErrorException('email already exists');
    }
  }
  async findAll(params?: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }) {
    return await this.prisma.user.findMany({
      ...params,
    });
  }

  async findOne(where: Prisma.UserWhereUniqueInput) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where,
      include: { client: true },
    });
    return this.exclude(user, ['password']);
  }
  exclude<User, Key extends keyof User>(
    user: User,
    keys: Key[],
  ): Omit<User, Key> {
    for (const key of keys) {
      delete user[key];
    }
    return user;
  }

  async update(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ) {
    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password.toString(), 10);
      data.password = hashedPassword;
    }
    return await this.prisma.user.update({
      where,
      data,
    });
  }
  async remove(where: Prisma.UserWhereUniqueInput) {
    return await this.prisma.user.delete({ where });
  }
}
