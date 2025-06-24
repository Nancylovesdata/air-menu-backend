// src/user-account/entities/user-account.entity.ts
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { UserProfileEntity } from '../../user-profile/entities/user-profile.entity';
import { AffiliationEntity } from '../../affiliation/entities/affiliation.entity';

@Entity('user_accounts')
export class UserAccountEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  twoFactorToken?: string;

  @Column({ type: 'timestamp', nullable: true })
  twoFactorTokenExpiration?: Date;

  @Column({ nullable: true })
  twoFactorTokenReference?: string;

  @Column({ nullable: true })
  session?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Column({ default: true })
  active: boolean;

  @OneToOne(() => UserProfileEntity, (userProfile) => userProfile.userAccount)
  userProfile: UserProfileEntity;

  @OneToMany(() => AffiliationEntity, (affiliation) => affiliation.userAccount)
  affiliations: AffiliationEntity[];
}
