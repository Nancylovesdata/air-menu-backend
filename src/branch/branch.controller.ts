// src/branch/branch.controller.ts
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
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Controller('branches') // Base route for this controller
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) // Apply ValidationPipe
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  /**
   * Handles POST requests to create a new branch.
   * @param createBranchDto The DTO containing data for the new branch.
   * @returns The created branch.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED) // Returns 201 Created on success
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchService.create(createBranchDto);
  }

  /**
   * Handles GET requests to retrieve all active branches.
   * @returns An array of branches.
   */
  @Get()
  @HttpCode(HttpStatus.OK) // Returns 200 OK on success
  findAll() {
    return this.branchService.findAll();
  }

  /**
   * Handles GET requests to retrieve a single branch by ID.
   * @param id The ID of the branch.
   * @returns The found branch.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK) // Returns 200 OK on success
  findOne(@Param('id') id: string) {
    return this.branchService.findOne(id);
  }

  /**
   * Handles PATCH requests to update an existing branch.
   * @param id The ID of the branch to update.
   * @param updateBranchDto The DTO containing update data.
   * @returns The updated branch.
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK) // Returns 200 OK on success
  update(@Param('id') id: string, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchService.update(id, updateBranchDto);
  }

  /**
   * Handles DELETE requests to soft-delete a branch.
   * @param id The ID of the branch to delete.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Returns 204 No Content on successful deletion
  remove(@Param('id') id: string) {
    return this.branchService.remove(id);
  }

  /**
   * Handles PATCH requests to restore a soft-deleted branch.
   * @param id The ID of the branch to restore.
   * @returns The restored branch.
   */
  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK) // Returns 200 OK on success
  restore(@Param('id') id: string) {
    return this.branchService.restore(id);
  }
}
