// src/organization/entities/organization.entity.ts
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { BranchEntity } from '../../branch/entities/branch.entity';
import { AffiliationEntity } from '../../affiliation/entities/affiliation.entity';

@Entity('organizations')
export class OrganizationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  organizationCode: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @OneToMany(() => BranchEntity, (branch) => branch.organization)
  branches: BranchEntity[];

  @OneToMany(() => AffiliationEntity, (affiliation) => affiliation.organization)
  affiliations: AffiliationEntity[];
}
