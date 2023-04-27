import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './users.controller';
import { PrismaService } from 'src/prisma.service';
import { UserService } from './users.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UsersModule {}
