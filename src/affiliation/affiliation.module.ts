// src/affiliation/affiliation.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AffiliationService } from './affiliation.service';
import { AffiliationController } from './affiliation.controller';
import { AffiliationEntity } from './entities/affiliation.entity'; // Import the AffiliationEntity

@Module({
  imports: [TypeOrmModule.forFeature([AffiliationEntity])], // Register AffiliationEntity
  controllers: [AffiliationController],
  providers: [AffiliationService],
  exports: [AffiliationService], // Export AffiliationService if needed by other modules
})
export class AffiliationModule {}
