import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../commom/entities/base.entity';
import { OrganizationEntity } from '../../organization/entities/organization.entity'; // Import OrganizationEntity

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
