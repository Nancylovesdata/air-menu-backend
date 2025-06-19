// src/affiliation/affiliation.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AffiliationService } from './affiliation.service';
import { AffiliationController } from './affiliation.controller';
import { AffiliationEntity } from './entities/affiliation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AffiliationEntity])],
  controllers: [AffiliationController],
  providers: [AffiliationService],
  exports: [AffiliationService],
})
export class AffiliationModule {}
