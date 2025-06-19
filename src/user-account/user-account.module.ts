// src/user-account/user-account.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccountService } from './user-account.service';
import { UserAccountController } from './user-account.controller';
import { UserAccountEntity } from './entities/user-account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserAccountEntity])],
  controllers: [UserAccountController],
  providers: [UserAccountService],
  exports: [UserAccountService],
})
export class UserAccountModule {}
