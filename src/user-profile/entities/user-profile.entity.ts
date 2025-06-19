import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { UserAccountEntity } from '../../user-account/entities/user-account.entity';

@Entity('user_profiles')
export class UserProfileEntity extends BaseEntity {
  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @OneToOne(() => UserAccountEntity, (userAccount) => userAccount.userProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userAccountId' })
  userAccount: UserAccountEntity;
}
