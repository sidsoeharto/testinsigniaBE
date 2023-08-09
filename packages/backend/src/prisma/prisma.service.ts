import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor() {
    super({
    });
  }

  async $onError(error: unknown) {
    console.error('Prisma Error:', error);
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
