import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tereni } from './tereni.entity';
import { TereniService } from './tereni.service';
import { TereniController } from './tereni.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tereni])],
  controllers: [TereniController],
  providers: [TereniService],
  exports: [TereniService],
})
export class TereniModule {}