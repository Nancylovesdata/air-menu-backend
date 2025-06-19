// src/user-profile/user-profile.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfileEntity } from './entities/user-profile.entity';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(UserProfileEntity)
    private userProfileRepository: Repository<UserProfileEntity>,
  ) {}

  /**
   * Finds a user profile by its ID.
   * @param id The ID of the user profile.
   * @returns The UserProfileEntity.
   * @throws NotFoundException if the profile is not found or is inactive/deleted.
   */
  async findOne(id: string): Promise<UserProfileEntity> {
    const userProfile = await this.userProfileRepository.findOne({
      where: { id, deletedAt: null, active: true },
    });

    if (!userProfile) {
      throw new NotFoundException(
        `User profile with ID '${id}' not found or is inactive.`,
      );
    }
    return userProfile;
  }

  /**
   * Finds a user profile associated with a specific user account ID.
   * @param userAccountId The ID of the associated user account.
   * @returns The UserProfileEntity.
   * @throws NotFoundException if the profile is not found or is inactive/deleted.
   */
  async findOneByUserAccountId(
    userAccountId: string,
  ): Promise<UserProfileEntity> {
    const userProfile = await this.userProfileRepository.findOne({
      where: {
        userAccount: { id: userAccountId },
        deletedAt: null,
        active: true,
      },
    });

    if (!userProfile) {
      throw new NotFoundException(
        `User profile for user account ID '${userAccountId}' not found or is inactive.`,
      );
    }
    return userProfile;
  }

  /**
   * Updates an existing user profile.
   * @param id The ID of the user profile to update.
   * @param updateUserProfileDto The DTO containing updated profile data.
   * @returns The updated UserProfileEntity.
   * @throws NotFoundException if the profile does not exist or is inactive/deleted.
   */
  async update(
    id: string,
    updateUserProfileDto: UpdateUserProfileDto,
  ): Promise<UserProfileEntity> {
    const userProfile = await this.findOne(id); // Ensures profile exists and is active

    // Apply updates
    Object.assign(userProfile, updateUserProfileDto);

    // If dateOfBirth is provided as a string, convert it to a Date object
    if (updateUserProfileDto.dateOfBirth) {
      userProfile.dateOfBirth = new Date(updateUserProfileDto.dateOfBirth);
    }

    return this.userProfileRepository.save(userProfile);
  }

  /**
   * Soft-deletes a user profile by setting its 'deletedAt' timestamp.
   * @param id The ID of the user profile to soft-delete.
   * @throws NotFoundException if the profile does not exist.
   */
  async remove(id: string): Promise<void> {
    const userProfile = await this.findOne(id); // Ensures profile exists and is active
    await this.userProfileRepository.softRemove(userProfile);
  }

  /**
   * Restores a soft-deleted user profile.
   * @param id The ID of the user profile to restore.
   * @returns The restored UserProfileEntity.
   * @throws NotFoundException if the profile does not exist or is not soft-deleted.
   */
  async restore(id: string): Promise<UserProfileEntity> {
    const userProfile = await this.userProfileRepository.findOne({
      where: { id },
      withDeleted: true, // Include soft-deleted entities in the search
    });

    if (!userProfile || userProfile.deletedAt === null) {
      throw new NotFoundException(
        `User profile with ID '${id}' not found or is not soft-deleted.`,
      );
    }

    userProfile.deletedAt = null;
    userProfile.active = true; // Optionally reactivate upon restore
    return this.userProfileRepository.save(userProfile);
  }

  // This method will be used internally by UserAccountService to create the profile
  // It's not exposed via a controller as profiles are created alongside accounts
  async createProfileForAccount(
    profileData: Partial<UserProfileEntity>,
  ): Promise<UserProfileEntity> {
    const newProfile = this.userProfileRepository.create(profileData);
    return this.userProfileRepository.save(newProfile);
  }
}
