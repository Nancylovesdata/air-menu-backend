import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { OrganizationEntity } from '../../organization/entities/organization.entity';

@Entity('branches')
export class BranchEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  branchCode: string;

  @Column()
  organizationId: string;
  @ManyToOne(
    () => OrganizationEntity,
    (organization) => organization.branches,
    { onDelete: 'CASCADE' },
  )
  organization: OrganizationEntity;
}
