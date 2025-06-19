// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrganizationEntity } from './organization/entities/organization.entity';
import { BranchEntity } from './branch/entities/branch.entity';
import { UserAccountEntity } from './user-account/entities/user-account.entity';
import { UserProfileEntity } from './user-profile/entities/user-profile.entity';
import { AffiliationEntity } from './affiliation/entities/affiliation.entity';
import { OrganizationModule } from './organization/organization.module';
import { BranchModule } from './branch/branch.module';
import { UserAccountModule } from './user-account/user-account.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { AffiliationModule } from './affiliation/affiliation.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [
          OrganizationEntity,
          BranchEntity,
          UserAccountEntity,
          UserProfileEntity,
          AffiliationEntity,
        ],
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),

    OrganizationModule,
    BranchModule,
    UserAccountModule,
    UserProfileModule,
    AffiliationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
