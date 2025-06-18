import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../entities/../entities/../../commom/entities/base.entity';
import { BranchEntity } from '../entities/../entities/../../branch/entities/branch.entity';
import { AffiliationEntity } from '../entities/../entities/../../affiliation/entities/affiliation.entity';

@Entity('organizations') // Table name
export class OrganizationEntity extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true }) // Assuming optional
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
