// src/branch/branch.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';
import { BranchEntity } from './entities/branch.entity';
import { OrganizationModule } from '../organization/organization.module'; // Import OrganizationModule

@Module({
  imports: [
    TypeOrmModule.forFeature([BranchEntity]),
    OrganizationModule, // Import OrganizationModule so BranchService can use OrganizationService
  ],
  controllers: [BranchController],
  providers: [BranchService],
  exports: [BranchService],
})
export class BranchModule {}
