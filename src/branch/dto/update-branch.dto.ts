// src/branch/dto/update-branch.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateBranchDto } from './create-branch.dto';

// PartialType makes all properties of CreateBranchDto optional for updates
export class UpdateBranchDto extends PartialType(CreateBranchDto) {}
