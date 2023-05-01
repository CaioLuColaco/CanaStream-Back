import { Module } from '@nestjs/common';
import { MusicsService } from './musics.service';
import { MusicsController } from './musics.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [MusicsController],
  providers: [MusicsService, PrismaService],
})
export class MusicsModule {}
