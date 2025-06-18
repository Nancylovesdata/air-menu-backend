// src/user-account/user-account.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccountService } from './user-account.service';
import { UserAccountController } from './user-account.controller';
import { UserAccountEntity } from './entities/user-account.entity'; // Import the UserAccountEntity

@Module({
  imports: [TypeOrmModule.forFeature([UserAccountEntity])], // Register UserAccountEntity
  controllers: [UserAccountController],
  providers: [UserAccountService],
  exports: [UserAccountService], // Export UserAccountService (AuthModule will need it)
})
export class UserAccountModule {}
