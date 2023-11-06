import { PrismaClient } from '@prisma/client';
import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // Add other Prisma methods as needed
  async onModuleInit() {
    await this.$connect();
    await this.$use(async (params, next) => {
      const before = Date.now();

      const result = await next(params);

      const after = Date.now();

      console.log(
        `Query ${params.model}.${params.action} took ${after - before}ms`,
      );

      return result;
    });
  }
}
