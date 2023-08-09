import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { ContactService } from './contacts.service';
import { ContactController } from './contacts.controller';

@Module({
  controllers: [ContactController],
  providers: [ContactService, PrismaService],
})
export class ContactsModule {}
