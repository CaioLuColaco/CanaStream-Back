import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from './auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [UsersModule, AuthModule, ConfigModule.forRoot()],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
