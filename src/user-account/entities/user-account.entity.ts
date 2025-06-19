// src/user-account/entities/user-account.entity.ts
import { Entity, Column, OneToOne, OneToMany } from 'typeorm'; // Remove JoinColumn import
import { BaseEntity } from '../../commom/entities/base.entity';
import { UserProfileEntity } from '../../user-profile/entities/user-profile.entity';
import { AffiliationEntity } from '../../affiliation/entities/affiliation.entity';

@Entity('user_accounts')
export class UserAccountEntity extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ default: false })
  twoFactorEnabled: boolean;

  @Column({ nullable: true })
  twoFactorToken?: string;

  @Column({ type: 'timestamp', nullable: true })
  twoFactorTokenExpiration?: Date;

  @Column({ nullable: true })
  twoFactorTokenReference?: string;

  // One-to-One relationship with UserProfileEntity
  // This side is the INVERSE side, it doesn't hold the foreign key
  @OneToOne(() => UserProfileEntity, (userProfile) => userProfile.userAccount, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  userProfile: UserProfileEntity; // No @JoinColumn here
  // Affiliation One-to-Many remains the same
  @OneToMany(() => AffiliationEntity, (affiliation) => affiliation.userAccount)
  affiliations: AffiliationEntity[];
}
