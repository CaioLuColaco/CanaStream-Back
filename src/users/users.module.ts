import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { PrismaService } from 'src/prisma.service';
import { UserService } from './users.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UsersModule {}
