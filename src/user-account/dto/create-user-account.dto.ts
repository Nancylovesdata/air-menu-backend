// src/user-account/dto/create-user-account.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsBoolean,
  IsOptional,
  IsDateString,
  IsEnum,
  IsPhoneNumber,
} from 'class-validator';

// Optional: Define an Enum for Gender if you want controlled values
export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
  PREFER_NOT_TO_SAY = 'Prefer not to say',
}

export class CreateUserAccountDto {
  // UserAccount fields
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  // Add more password complexity rules here (e.g., regex for uppercase, lowercase, number, special char)
  password: string;

  @IsBoolean()
  @IsOptional() // Users might not enable 2FA on creation
  twoFactorEnabled?: boolean = false; // Default to false if not provided

  // UserProfile fields (for initial creation)
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: string; // Use string for DTO, convert to Date in service

  @IsPhoneNumber('GH', { message: 'Invalid Ghanaian phone number format.' }) // Using 'GH' as discussed
  @IsString()
  @IsOptional() // Phone number in profile can be optional
  phoneNumber?: string;

  @IsEnum(Gender) // Validate against the Gender enum
  @IsOptional()
  gender?: Gender;
}
