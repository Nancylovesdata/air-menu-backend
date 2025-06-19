// src/user-profile/user-profile.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfileService } from './user-profile.service';
import { UserProfileController } from './user-profile.controller';
import { UserProfileEntity } from './entities/user-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserProfileEntity])],
  controllers: [UserProfileController],
  providers: [UserProfileService],
  exports: [UserProfileService, TypeOrmModule], // Export UserProfileService and TypeOrmModule for UserAccountModule
})
export class UserProfileModule {}
