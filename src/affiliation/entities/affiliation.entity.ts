import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../entities/../entities/../../commom/entities/base.entity';
import { UserAccountEntity } from '../../user-account/entities/user-account.entity'; // Import UserAccountEntity
import { OrganizationEntity } from '../../organization/entities/organization.entity'; // Import OrganizationEntity

@Entity('affiliations')
export class AffiliationEntity extends BaseEntity {
  @Column()
  userAccountId: string; // Foreign key

  @Column()
  organizationId: string; // Foreign key

  @Column()
  role: string; // e.g., 'admin', 'employee', 'manager' within this organization

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
