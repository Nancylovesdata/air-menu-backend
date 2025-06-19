// src/user-profile/user-profile.controller.ts
import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@Controller('profiles') // Base route for user profiles
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  /**
   * Handles GET requests to retrieve a single user profile by ID.
   * @param id The ID of the user profile.
   * @returns The found user profile.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.userProfileService.findOne(id);
  }

  /**
   * Handles PATCH requests to update an existing user profile.
   * @param id The ID of the user profile to update.
   * @param updateUserProfileDto The DTO containing update data.
   * @returns The updated user profile.
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    return this.userProfileService.update(id, updateUserProfileDto);
  }

  /**
   * Handles DELETE requests to soft-delete a user profile.
   * Note: Deleting a profile typically should cascade from deleting the account.
   * This endpoint is more for direct profile management if needed.
   * @param id The ID of the user profile to delete.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.userProfileService.remove(id);
  }

  /**
   * Handles PATCH requests to restore a soft-deleted user profile.
   * @param id The ID of the user profile to restore.
   * @returns The restored user profile.
   */
  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  restore(@Param('id') id: string) {
    return this.userProfileService.restore(id);
  }
}
