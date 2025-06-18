// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Default App components
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Import all your entities
import { OrganizationEntity } from './organization/entities/organization.entity';
import { BranchEntity } from './branch/entities/branch.entity';
import { UserAccountEntity } from './user-account/entities/user-account.entity';
import { UserProfileEntity } from './user-profile/entities/user-profile.entity';
import { AffiliationEntity } from './affiliation/entities/affiliation.entity';

// Import all your feature modules
import { OrganizationModule } from './organization/organization.module';
import { BranchModule } from './branch/branch.module';
import { UserAccountModule } from './user-account/user-account.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { AffiliationModule } from './affiliation/affiliation.module';
@Module({
  imports: [
    // Global configuration module to load .env variables
    ConfigModule.forRoot({ isGlobal: true }),

    // TypeORM database connection configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Make ConfigService available
      useFactory: (configService: ConfigService) => ({
        type: 'postgres', // Or 'mysql', 'sqlite', 'mongodb' etc.
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [
          // List ALL your TypeORM entities here
          OrganizationEntity,
          BranchEntity,
          UserAccountEntity,
          UserProfileEntity,
          AffiliationEntity,
        ],
        synchronize: true, // Auto-create table schemas based on entities (USE MIGRATIONS IN PRODUCTION!)
        logging: true, // Enable SQL query logging (useful for development)
      }),
      inject: [ConfigService], // Inject ConfigService into the factory function
    }),

    // Your feature modules for user management and related entities
    OrganizationModule,
    BranchModule,
    UserAccountModule,
    UserProfileModule,
    AffiliationModule,
  ],
  controllers: [
    AppController, // The default root controller (e.g., handles '/')
  ],
  providers: [
    AppService, // The default root service
  ],
})
export class AppModule {}
