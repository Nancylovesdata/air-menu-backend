// src/user-account/user-account.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { UserAccountService } from './user-account.service';
import { CreateUserAccountDto } from './dto/create-user-account.dto';
import { UpdateUserAccountDto } from './dto/update-user-account.dto';

@Controller('users') // Base route for user accounts
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class UserAccountController {
  constructor(private readonly userAccountService: UserAccountService) {}

  /**
   * Registers a new user account and creates an associated profile.
   * @param createUserAccountDto The DTO containing user account and profile data.
   * @returns The created user account with its profile.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserAccountDto: CreateUserAccountDto) {
    return this.userAccountService.create(createUserAccountDto);
  }

  /**
   * Retrieves all active user accounts.
   * @returns An array of user accounts.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.userAccountService.findAll();
  }

  /**
   * Retrieves a single user account by ID.
   * @param id The ID of the user account.
   * @returns The found user account.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.userAccountService.findOne(id);
  }

  /**
   * Updates an existing user account.
   * @param id The ID of the user account to update.
   * @param updateUserAccountDto The DTO containing update data.
   * @returns The updated user account.
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateUserAccountDto: UpdateUserAccountDto,
  ) {
    return this.userAccountService.update(id, updateUserAccountDto);
  }

  /**
   * Soft-deletes a user account.
   * @param id The ID of the user account to delete.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.userAccountService.remove(id);
  }

  /**
   * Restores a soft-deleted user account.
   * @param id The ID of the user account to restore.
   * @returns The restored user account.
   */
  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  restore(@Param('id') id: string) {
    return this.userAccountService.restore(id);
  }
}
