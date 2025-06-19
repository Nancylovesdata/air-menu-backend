// src/organization/organization.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizationEntity } from './entities/organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(OrganizationEntity)
    private organizationRepository: Repository<OrganizationEntity>,
  ) {}

  /**
   * Creates a new organization.
   * Checks for unique 'email' and 'organizationCode' before creation.
   * @param createOrganizationDto The DTO containing organization data.
   * @returns The created OrganizationEntity.
   */
  async create(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<OrganizationEntity> {
    const { email, organizationCode } = createOrganizationDto;

    // Check for existing organization with the same email
    const existingByEmail = await this.organizationRepository.findOne({
      where: { email },
    });
    if (existingByEmail) {
      throw new ConflictException(
        `Organization with email '${email}' already exists.`,
      );
    }

    // Check for existing organization with the same organizationCode
    const existingByCode = await this.organizationRepository.findOne({
      where: { organizationCode },
    });
    if (existingByCode) {
      throw new ConflictException(
        `Organization with code '${organizationCode}' already exists.`,
      );
    }

    // Create a new organization entity from the DTO
    const newOrganization = this.organizationRepository.create(
      createOrganizationDto,
    );

    // Save the new organization to the database
    return this.organizationRepository.save(newOrganization);
  }

  /**
   * Retrieves all organizations that are not soft-deleted.
   * @returns A promise that resolves to an array of OrganizationEntity.
   */
  async findAll(): Promise<OrganizationEntity[]> {
    return this.organizationRepository.find({
      where: { deletedAt: null, active: true }, // Only return active, non-deleted organizations
      order: { name: 'ASC' }, // Order by name for consistency
    });
  }

  /**
   * Retrieves a single organization by its ID.
   * Throws NotFoundException if the organization does not exist or is soft-deleted.
   * @param id The ID of the organization.
   * @returns A promise that resolves to an OrganizationEntity.
   */
  async findOne(id: string): Promise<OrganizationEntity> {
    const organization = await this.organizationRepository.findOne({
      where: { id, deletedAt: null, active: true }, // Ensure it's active and not deleted
    });

    if (!organization) {
      throw new NotFoundException(
        `Organization with ID '${id}' not found or is inactive.`,
      );
    }
    return organization;
  }

  /**
   * Updates an existing organization.
   * Checks for unique 'email' and 'organizationCode' if they are being updated.
   * Throws NotFoundException if the organization does not exist or is soft-deleted.
   * Throws ConflictException if updated email or organizationCode conflicts with another organization.
   * @param id The ID of the organization to update.
   * @param updateOrganizationDto The DTO containing updated organization data.
   * @returns The updated OrganizationEntity.
   */
  async update(
    id: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<OrganizationEntity> {
    const organization = await this.findOne(id); // Use findOne to ensure existence and active status

    // Check for email uniqueness if email is being updated and is different from current
    if (
      updateOrganizationDto.email &&
      updateOrganizationDto.email !== organization.email
    ) {
      const existingByEmail = await this.organizationRepository.findOne({
        where: {
          email: updateOrganizationDto.email,
          id: expect.not.stringMatching(id),
        }, // Check other organizations
      });
      if (existingByEmail) {
        throw new ConflictException(
          `Email '${updateOrganizationDto.email}' is already used by another organization.`,
        );
      }
    }

    // Check for organizationCode uniqueness if code is being updated and is different from current
    if (
      updateOrganizationDto.organizationCode &&
      updateOrganizationDto.organizationCode !== organization.organizationCode
    ) {
      const existingByCode = await this.organizationRepository.findOne({
        where: {
          organizationCode: updateOrganizationDto.organizationCode,
          id: expect.not.stringMatching(id),
        }, // Check other organizations
      });
      if (existingByCode) {
        throw new ConflictException(
          `Organization code '${updateOrganizationDto.organizationCode}' is already in use by another organization.`,
        );
      }
    }

    // Apply updates and save
    Object.assign(organization, updateOrganizationDto);
    return this.organizationRepository.save(organization);
  }

  /**
   * Soft-deletes an organization by setting its 'deletedAt' timestamp.
   * Throws NotFoundException if the organization does not exist.
   * @param id The ID of the organization to soft-delete.
   */
  async remove(id: string): Promise<void> {
    const organization = await this.findOne(id); // Use findOne to ensure existence and active status
    await this.organizationRepository.softRemove(organization); // Soft delete using TypeORM's method
  }

  /**
   * Restores a soft-deleted organization.
   * Throws NotFoundException if the organization does not exist or is not soft-deleted.
   * @param id The ID of the organization to restore.
   * @returns The restored OrganizationEntity.
   */
  async restore(id: string): Promise<OrganizationEntity> {
    const organization = await this.organizationRepository.findOne({
      where: { id },
      withDeleted: true, // Include soft-deleted entities in the search
    });

    if (!organization || organization.deletedAt === null) {
      throw new NotFoundException(
        `Organization with ID '${id}' not found or is not soft-deleted.`,
      );
    }

    organization.deletedAt = null; // Clear the deletedAt timestamp
    organization.active = true; // Optionally reactivate upon restore
    return this.organizationRepository.save(organization);
  }
}
