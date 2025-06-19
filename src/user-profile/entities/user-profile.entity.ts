import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../commom/entities/base.entity';
import { UserAccountEntity } from '../../user-account/entities/user-account.entity'; // Import UserAccountEntity

@Entity('user_profiles')
export class UserProfileEntity extends BaseEntity {
  // @Column() // This column is implicit via the OneToOne relationship with @JoinColumn
  // userAccountId: string; // The diagram shows this as a string, but it's the FK of UserAccountEntity

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  // Relation to UserAccount (One-to-One)
  @OneToOne(() => UserAccountEntity, (userAccount) => userAccount.userProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userAccountId' }) // Specify the FK column name
  userAccount: UserAccountEntity;
}
