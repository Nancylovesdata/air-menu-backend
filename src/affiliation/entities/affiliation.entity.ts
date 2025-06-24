// src/affiliation/entities/affiliation.entity.ts
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserAccountEntity } from '../../user-account/entities/user-account.entity';
import { OrganizationEntity } from '../../organization/entities/organization.entity';

@Entity('affiliations')
export class AffiliationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userAccountId: string;

  @Column()
  organizationId: string;

  @Column()
  role: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @ManyToOne(() => UserAccountEntity, (userAccount) => userAccount.affiliations)
  @JoinColumn({ name: 'userAccountId' })
  userAccount: UserAccountEntity;

  @ManyToOne(
    () => OrganizationEntity,
    (organization) => organization.affiliations,
  )
  @JoinColumn({ name: 'organizationId' })
  organization: OrganizationEntity;
}
