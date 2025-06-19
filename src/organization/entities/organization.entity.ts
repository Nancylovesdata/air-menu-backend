// src/organization/entities/organization.entity.ts
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../commom/entities/base.entity'; // Corrected path assumption
import { BranchEntity } from '../../branch/entities/branch.entity';
import { AffiliationEntity } from '../../affiliation/entities/affiliation.entity';

@Entity('organizations') // Table name
export class OrganizationEntity extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: false }) // <-- CHANGE from nullable: true to nullable: false (or remove it as false is default)
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
