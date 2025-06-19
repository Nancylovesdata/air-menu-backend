// src/user-profile/dto/update-user-profile.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsEnum,
  IsPhoneNumber,
} from 'class-validator';
// Corrected import path for Gender Enum
import { Gender } from '../../user-account/dto/create-user-account.dto';

// Define a base for profile-specific updates that can be partially applied
class BaseUpdateUserProfileDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  firstName?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  lastName?: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @IsPhoneNumber('GH', { message: 'Invalid Ghanaian phone number format.' })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;
}

// PartialType makes all properties of BaseUpdateUserProfileDto optional
export class UpdateUserProfileDto extends PartialType(
  BaseUpdateUserProfileDto,
) {}
