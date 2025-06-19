// src/user-account/user-account.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccountService } from './user-account.service';
import { UserAccountController } from './user-account.controller';
import { UserAccountEntity } from './entities/user-account.entity';
import { UserProfileModule } from '../user-profile/user-profile.module'; // Import UserProfileModule

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAccountEntity]),
    UserProfileModule, // Import UserProfileModule so UserAccountService can use UserProfileService
  ],
  controllers: [UserAccountController],
  providers: [UserAccountService],
  exports: [UserAccountService], // Export UserAccountService if other modules need to use it
})
export class UserAccountModule {}
