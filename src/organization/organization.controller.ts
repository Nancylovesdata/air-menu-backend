// src/organization/organization.controller.ts
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
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Controller('organizations') // Base route for this controller
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) // Apply ValidationPipe to this controller
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  /**
   * Handles POST requests to create a new organization.
   * @param createOrganizationDto The DTO containing data for the new organization.
   * @returns The created organization.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED) // Returns 201 Created on success
  create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationService.create(createOrganizationDto);
  }

  /**
   * Handles GET requests to retrieve all active organizations.
   * @returns An array of organizations.
   */
  @Get()
  @HttpCode(HttpStatus.OK) // Returns 200 OK on success
  findAll() {
    return this.organizationService.findAll();
  }

  /**
   * Handles GET requests to retrieve a single organization by ID.
   * @param id The ID of the organization.
   * @returns The found organization.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK) // Returns 200 OK on success
  findOne(@Param('id') id: string) {
    return this.organizationService.findOne(id);
  }

  /**
   * Handles PATCH requests to update an existing organization.
   * @param id The ID of the organization to update.
   * @param updateOrganizationDto The DTO containing update data.
   * @returns The updated organization.
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK) // Returns 200 OK on success
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationService.update(id, updateOrganizationDto);
  }

  /**
   * Handles DELETE requests to soft-delete an organization.
   * @param id The ID of the organization to delete.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Returns 204 No Content on successful deletion
  remove(@Param('id') id: string) {
    return this.organizationService.remove(id);
  }

  /**
   * Handles PATCH requests to restore a soft-deleted organization.
   * This is a custom endpoint, often placed on a specific route like `restore`.
   * @param id The ID of the organization to restore.
   * @returns The restored organization.
   */
  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK) // Returns 200 OK on success
  restore(@Param('id') id: string) {
    return this.organizationService.restore(id);
  }
}
