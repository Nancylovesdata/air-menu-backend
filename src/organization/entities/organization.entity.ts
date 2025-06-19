import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { BranchEntity } from '../../branch/entities/branch.entity';
import { AffiliationEntity } from '../../affiliation/entities/affiliation.entity';

@Entity('organizations')
export class OrganizationEntity extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  organizationCode: string;

  @OneToMany(() => BranchEntity, (branch) => branch.organization)
  branches: BranchEntity[];

  @OneToMany(() => AffiliationEntity, (affiliation) => affiliation.organization)
  affiliations: AffiliationEntity[];
}
