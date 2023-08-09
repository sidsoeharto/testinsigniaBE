import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { ContactGroupController } from './groups.controller';
import { ContactGroupService } from './groups.service';

@Module({
  controllers: [ContactGroupController],
  providers: [ContactGroupService, PrismaService],
})
export class GroupsModule {}
