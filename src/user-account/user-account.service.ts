// src/user-account/user-account.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs'; // Import bcryptjs
import { UserAccountEntity } from './entities/user-account.entity';
import { CreateUserAccountDto } from './dto/create-user-account.dto';
import { UpdateUserAccountDto } from './dto/update-user-account.dto';
import { UserProfileService } from '../user-profile/user-profile.service'; // Import UserProfileService

@Injectable()
export class UserAccountService {
  constructor(
    @InjectRepository(UserAccountEntity)
    private userAccountRepository: Repository<UserAccountEntity>,
    private userProfileService: UserProfileService, // Inject UserProfileService
  ) {}

  /**
   * Registers a new user account and creates an associated user profile.
   * Hashes the password before saving.
   * @param createUserAccountDto The DTO containing user account and profile data.
   * @returns The created UserAccountEntity with its associated UserProfile.
   */
  async create(
    createUserAccountDto: CreateUserAccountDto,
  ): Promise<UserAccountEntity> {
    const {
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      phoneNumber,
      gender,
      twoFactorEnabled,
    } = createUserAccountDto;

    // 1. Check if email already exists
    const existingAccount = await this.userAccountRepository.findOne({
      where: { email },
    });
    if (existingAccount) {
      throw new ConflictException(
        `User account with email '${email}' already exists.`,
      );
    }

    // 2. Hash the password
    const passwordHash = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // 3. Create the UserProfile entity first (or prepare it)
    const newProfile = await this.userProfileService.createProfileForAccount({
      firstName,
      lastName,
      // Convert dateOfBirth string to Date object
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      phoneNumber,
      gender,
    });

    // 4. Create the UserAccount entity
    const newAccount = this.userAccountRepository.create({
      email,
      passwordHash,
      twoFactorEnabled,
      userProfile: newProfile, // Link the created user profile
    });

    // 5. Save the UserAccount (which will also save UserProfile due to cascade: true)
    return this.userAccountRepository.save(newAccount);
  }

  /**
   * Retrieves all active user accounts, optionally including their profiles.
   * @returns An array of UserAccountEntity.
   */
  async findAll(): Promise<UserAccountEntity[]> {
    return this.userAccountRepository.find({
      where: { deletedAt: null, active: true },
      relations: ['userProfile'], // Eager load user profile data
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Retrieves a single user account by its ID.
   * @param id The ID of the user account.
   * @returns The UserAccountEntity.
   * @throws NotFoundException if the account is not found or is inactive/deleted.
   */
  async findOne(id: string): Promise<UserAccountEntity> {
    const userAccount = await this.userAccountRepository.findOne({
      where: { id, deletedAt: null, active: true },
      relations: ['userProfile'], // Eager load user profile data
    });

    if (!userAccount) {
      throw new NotFoundException(
        `User account with ID '${id}' not found or is inactive.`,
      );
    }
    return userAccount;
  }

  /**
   * Updates an existing user account.
   * Handles password hashing if password is provided in update.
   * @param id The ID of the user account to update.
   * @param updateUserAccountDto The DTO containing updated account data.
   * @returns The updated UserAccountEntity.
   * @throws NotFoundException if the account does not exist or is inactive/deleted.
   * @throws ConflictException if updated email already exists.
   */
  async update(
    id: string,
    updateUserAccountDto: UpdateUserAccountDto,
  ): Promise<UserAccountEntity> {
    const userAccount = await this.findOne(id); // Ensures account exists and is active

    // Check for email uniqueness if email is being updated and is different from current
    if (
      updateUserAccountDto.email &&
      updateUserAccountDto.email !== userAccount.email
    ) {
      const existingAccountByEmail = await this.userAccountRepository.findOne({
        where: {
          email: updateUserAccountDto.email,
          id: expect.not.stringMatching(id),
        }, // Check other accounts
      });
      if (existingAccountByEmail) {
        throw new ConflictException(
          `Email '${updateUserAccountDto.email}' is already in use by another account.`,
        );
      }
    }

    // Hash new password if provided
    if (updateUserAccountDto.password) {
      userAccount.passwordHash = await bcrypt.hash(
        updateUserAccountDto.password,
        10,
      );
      delete updateUserAccountDto.password; // Remove plain password from DTO before assign
    }

    // Apply other updates
    Object.assign(userAccount, updateUserAccountDto);
    return this.userAccountRepository.save(userAccount);
  }

  /**
   * Soft-deletes a user account by setting its 'deletedAt' timestamp.
   * Due to onDelete: 'CASCADE' in entity, associated UserProfile will also be soft-deleted.
   * @param id The ID of the user account to soft-delete.
   * @throws NotFoundException if the account does not exist.
   */
  async remove(id: string): Promise<void> {
    const userAccount = await this.findOne(id); // Ensures account exists and is active
    await this.userAccountRepository.softRemove(userAccount);
    // UserProfile is cascaded, so it will also be soft-removed by TypeORM
  }

  /**
   * Restores a soft-deleted user account.
   * Due to cascade, associated UserProfile should also be restored.
   * @param id The ID of the user account to restore.
   * @returns The restored UserAccountEntity.
   * @throws NotFoundException if the account does not exist or is not soft-deleted.
   */
  async restore(id: string): Promise<UserAccountEntity> {
    const userAccount = await this.userAccountRepository.findOne({
      where: { id },
      withDeleted: true, // Include soft-deleted entities in the search
      relations: ['userProfile'], // Load profile to restore it too
    });

    if (!userAccount || userAccount.deletedAt === null) {
      throw new NotFoundException(
        `User account with ID '${id}' not found or is not soft-deleted.`,
      );
    }

    userAccount.deletedAt = null;
    userAccount.active = true; // Optionally reactivate upon restore

    // Also restore the associated user profile if it was soft-deleted
    if (userAccount.userProfile && userAccount.userProfile.deletedAt) {
      userAccount.userProfile.deletedAt = null;
      userAccount.userProfile.active = true;
      await this.userProfileService.update(userAccount.userProfile.id, {}); // Trigger save for user profile
    }

    return this.userAccountRepository.save(userAccount);
  }
}
