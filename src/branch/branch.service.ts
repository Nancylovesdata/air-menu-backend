// src/branch/branch.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BranchEntity } from './entities/branch.entity';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { OrganizationService } from '../organization/organization.service'; // Import OrganizationService

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(BranchEntity)
    private branchRepository: Repository<BranchEntity>,
    private organizationService: OrganizationService, // Inject OrganizationService
  ) {}

  /**
   * Creates a new branch.
   * Ensures the associated organization exists and the branch code is unique.
   * @param createBranchDto The DTO containing branch data.
   * @returns The created BranchEntity.
   */
  async create(createBranchDto: CreateBranchDto): Promise<BranchEntity> {
    const { organizationId, branchCode } = createBranchDto;

    // 1. Verify that the organization exists and is active/not deleted
    const organization = await this.organizationService.findOne(organizationId);
    // findOne already throws NotFoundException if not found, so no extra check needed here.

    // 2. Check for unique branchCode globally (as per entity definition)
    const existingBranchByCode = await this.branchRepository.findOne({
      where: { branchCode },
    });
    if (existingBranchByCode) {
      throw new ConflictException(
        `Branch with code '${branchCode}' already exists.`,
      );
    }

    // Create a new branch entity, linking it to the organization
    const newBranch = this.branchRepository.create({
      ...createBranchDto,
      organization: organization, // Link the entity directly
    });

    // Save the new branch to the database
    return this.branchRepository.save(newBranch);
  }

  /**
   * Retrieves all branches that are not soft-deleted.
   * Can optionally eager-load the associated organization.
   * @returns A promise that resolves to an array of BranchEntity.
   */
  async findAll(): Promise<BranchEntity[]> {
    return this.branchRepository.find({
      where: { deletedAt: null, active: true },
      relations: ['organization'], // Eager load organization data if needed
      order: { name: 'ASC' },
    });
  }

  /**
   * Retrieves a single branch by its ID.
   * Throws NotFoundException if the branch does not exist or is soft-deleted.
   * @param id The ID of the branch.
   * @returns A promise that resolves to a BranchEntity.
   */
  async findOne(id: string): Promise<BranchEntity> {
    const branch = await this.branchRepository.findOne({
      where: { id, deletedAt: null, active: true },
      relations: ['organization'], // Eager load organization data if needed
    });

    if (!branch) {
      throw new NotFoundException(
        `Branch with ID '${id}' not found or is inactive.`,
      );
    }
    return branch;
  }

  /**
   * Updates an existing branch.
   * Handles potential conflicts if 'branchCode' or 'organizationId' are updated.
   * Throws NotFoundException if the branch does not exist or is soft-deleted.
   * Throws ConflictException if updated branchCode conflicts or organizationId is invalid.
   * @param id The ID of the branch to update.
   * @param updateBranchDto The DTO containing updated branch data.
   * @returns The updated BranchEntity.
   */
  async update(
    id: string,
    updateBranchDto: UpdateBranchDto,
  ): Promise<BranchEntity> {
    const branch = await this.findOne(id); // Use findOne to ensure existence and active status

    // Check for branchCode uniqueness if being updated and is different from current
    if (
      updateBranchDto.branchCode &&
      updateBranchDto.branchCode !== branch.branchCode
    ) {
      const existingBranchByCode = await this.branchRepository.findOne({
        where: {
          branchCode: updateBranchDto.branchCode,
          id: expect.not.stringMatching(id),
        }, // Check other branches
      });
      if (existingBranchByCode) {
        throw new ConflictException(
          `Branch code '${updateBranchDto.branchCode}' is already in use by another branch.`,
        );
      }
    }

    // If organizationId is being updated, verify the new organization exists
    if (
      updateBranchDto.organizationId &&
      updateBranchDto.organizationId !== branch.organization.id
    ) {
      const newOrganization = await this.organizationService.findOne(
        updateBranchDto.organizationId,
      );
      branch.organization = newOrganization; // Update the relationship
      delete updateBranchDto.organizationId; // Prevent Object.assign from overwriting the relation object
    }

    // Apply updates and save
    Object.assign(branch, updateBranchDto);
    return this.branchRepository.save(branch);
  }

  /**
   * Soft-deletes a branch by setting its 'deletedAt' timestamp.
   * Throws NotFoundException if the branch does not exist.
   * @param id The ID of the branch to soft-delete.
   */
  async remove(id: string): Promise<void> {
    const branch = await this.findOne(id); // Use findOne to ensure existence and active status
    await this.branchRepository.softRemove(branch); // Soft delete using TypeORM's method
  }

  /**
   * Restores a soft-deleted branch.
   * Throws NotFoundException if the branch does not exist or is not soft-deleted.
   * @param id The ID of the branch to restore.
   * @returns The restored BranchEntity.
   */
  async restore(id: string): Promise<BranchEntity> {
    const branch = await this.branchRepository.findOne({
      where: { id },
      withDeleted: true, // Include soft-deleted entities in the search
    });

    if (!branch || branch.deletedAt === null) {
      throw new NotFoundException(
        `Branch with ID '${id}' not found or is not soft-deleted.`,
      );
    }

    branch.deletedAt = null; // Clear the deletedAt timestamp
    branch.active = true; // Optionally reactivate upon restore
    return this.branchRepository.save(branch);
  }
}
