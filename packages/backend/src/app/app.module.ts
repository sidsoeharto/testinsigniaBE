import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma/prisma.service';
import { UsersModule } from '../users/users.module';
import { ContactsModule } from '../contacts/contacts.module';
import { GroupsModule } from '../groups/groups.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
    UsersModule,
    ContactsModule,
    GroupsModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
