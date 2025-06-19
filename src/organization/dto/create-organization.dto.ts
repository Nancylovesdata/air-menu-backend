// src/organization/dto/create-organization.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  // IsOptional, // Already removed, correct
  MinLength,
  IsPhoneNumber,
} from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, {
    message: 'Organization name must be at least 3 characters long',
  })
  name: string;

  // CHANGED THIS LINE: Specify 'GH' for Ghanaian phone number validation
  @IsPhoneNumber('GH', { message: 'Invalid Ghanaian phone number format.' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string; // Already 'string', correct

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4, {
    message: 'Organization code must be at least 4 characters long',
  })
  organizationCode: string;
}
