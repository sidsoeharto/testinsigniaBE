import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';

import { ContactGroupService } from './groups.service';
import { ContactGroup } from './group.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('groups')
@UseGuards(JwtAuthGuard)
export class ContactGroupController {
  constructor(private readonly contactGroupService: ContactGroupService) {}

  @Get()
  async getAllContactGroups(): Promise<ContactGroup[]> {
    return this.contactGroupService.getAllContactGroups();
  }

  @Get(':id')
  async getContactGroupById(@Param('id') id: string): Promise<ContactGroup> {
    return this.contactGroupService.getContactGroupById(id);
  }

  @Post()
  async createContactGroup(@Body() data: ContactGroup): Promise<ContactGroup> {
    return this.contactGroupService.createContactGroup(data);
  }

  @Put(':id')
  async updateContactGroup(@Param('id') id: string, @Body() data: ContactGroup): Promise<ContactGroup> {
    return this.contactGroupService.updateContactGroup(id, data);
  }

  @Delete(':id')
  async deleteContactGroup(@Param('id') id: string): Promise<ContactGroup> {
    return this.contactGroupService.deleteContactGroup(id);
  }
}
