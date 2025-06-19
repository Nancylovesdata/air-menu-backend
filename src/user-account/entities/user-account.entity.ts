import { Entity, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { UserProfileEntity } from '../../user-profile/entities/user-profile.entity';
import { BaseEntity } from '../../common/entities/base.entity';
import { AffiliationEntity } from '../../affiliation/entities/affiliation.entity';

@Entity('user_accounts')
export class UserAccountEntity extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  twoFactorToken: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  twoFactorTokenExpiration: Date;

  @Column({ nullable: true })
  twoFactorTokenReference: string;

  @Column({ nullable: true })
  session: string;

  // Relation to UserProfile (One-to-One)
  @OneToOne(() => UserProfileEntity, (userProfile) => userProfile.userAccount, {
    cascade: true,
  })
  @JoinColumn()
  userProfile: UserProfileEntity;

  // Relation to Affiliation (One-to-Many - a user account can have multiple affiliations)
  @OneToMany(() => AffiliationEntity, (affiliation) => affiliation.userAccount)
  affiliations: AffiliationEntity[];
}
