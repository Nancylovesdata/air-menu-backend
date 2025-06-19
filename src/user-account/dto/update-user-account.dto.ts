// src/user-account/dto/update-user-account.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsBoolean,
  IsOptional,
} from 'class-validator';

// Define a base for account-specific updates that can be partially applied
class BaseUpdateUserAccountDto {
  @IsEmail()
  @IsOptional() // Email is optional for update
  email?: string;

  @IsString()
  @IsOptional() // Password update is optional
  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  password?: string; // New password

  @IsBoolean()
  @IsOptional()
  twoFactorEnabled?: boolean;
}

// PartialType makes all properties of BaseUpdateUserAccountDto optional
export class UpdateUserAccountDto extends PartialType(
  BaseUpdateUserAccountDto,
) {}
