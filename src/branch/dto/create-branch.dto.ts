// src/branch/dto/create-branch.dto.ts
import { IsString, IsNotEmpty, MinLength, IsUUID } from 'class-validator';

export class CreateBranchDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Branch name must be at least 3 characters long' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Branch code must be at least 3 characters long' })
  // Assuming branchCode is globally unique as per the entity definition
  branchCode: string;

  @IsUUID('4', { message: 'Organization ID must be a valid UUID' }) // '4' indicates UUID v4
  @IsNotEmpty()
  organizationId: string; // Foreign key to OrganizationEntity
}
