// src/user-profile/user-profile.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfileService } from './user-profile.service';
import { UserProfileController } from './user-profile.controller';
import { UserProfileEntity } from './entities/user-profile.entity'; // Import the UserProfileEntity

@Module({
  imports: [TypeOrmModule.forFeature([UserProfileEntity])], // Register UserProfileEntity
  controllers: [UserProfileController],
  providers: [UserProfileService],
  exports: [UserProfileService], // Export UserProfileService if needed by other modules
})
export class UserProfileModule {}
