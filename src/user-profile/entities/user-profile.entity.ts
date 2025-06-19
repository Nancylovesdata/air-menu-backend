// src/user-profile/entities/user-profile.entity.ts
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm'; // Add JoinColumn import
import { BaseEntity } from '../../commom/entities/base.entity';
import { UserAccountEntity } from '../../user-account/entities/user-account.entity';

@Entity('user_profiles')
export class UserProfileEntity extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth?: Date;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  gender?: string;

  // One-to-One relationship with UserAccountEntity
  // This side is the OWNING side, it holds the foreign key
  @OneToOne(() => UserAccountEntity, (userAccount) => userAccount.userProfile)
  @JoinColumn({ name: 'user_account_id' }) // This creates the foreign key column in user_profiles table
  userAccount: UserAccountEntity;
}
