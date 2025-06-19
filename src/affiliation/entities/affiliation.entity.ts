import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { UserAccountEntity } from '../../user-account/entities/user-account.entity';
import { OrganizationEntity } from '../../organization/entities/organization.entity';

@Entity('affiliations')
export class AffiliationEntity extends BaseEntity {
  @Column()
  userAccountId: string;

  @Column()
  organizationId: string;

  @Column()
  role: string;

  @ManyToOne(
    () => UserAccountEntity,
    (userAccount) => userAccount.affiliations,
    { onDelete: 'CASCADE' },
  )
  userAccount: UserAccountEntity;

  @ManyToOne(
    () => OrganizationEntity,
    (organization) => organization.affiliations,
    { onDelete: 'CASCADE' },
  )
  organization: OrganizationEntity;
}
