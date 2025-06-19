// src/organization/dto/update-organization.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateOrganizationDto } from './create-organization.dto';

// PartialType makes all properties of CreateOrganizationDto optional
export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {}
