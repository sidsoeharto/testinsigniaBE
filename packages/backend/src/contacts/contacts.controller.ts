import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ContactService } from './contacts.service';
import { Contact, ContactData } from './contact.entity';

@Controller('contacts')
@UseGuards(JwtAuthGuard)
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  @ApiOperation({ summary: 'Get Contacts' })
  @ApiResponse({ status: 200, description: 'Returns contact list' })
  @HttpCode(HttpStatus.OK)
  async getAllContacts(): Promise<ContactData[]> {
    return this.contactService.getAllContacts();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Contact By ID' })
  @ApiResponse({ status: 200, description: 'Returns contact' })
  @HttpCode(HttpStatus.OK)
  async getContactById(@Param('id') id: string): Promise<ContactData> {
    return this.contactService.getContactById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Add Contact' })
  @ApiResponse({ status: 201, description: 'Returns added contact' })
  @HttpCode(HttpStatus.CREATED)
  async createContact(@Body() data: Contact): Promise<Contact> {
    return this.contactService.createContact(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Contact' })
  @ApiResponse({ status: 200, description: 'Returns updated contact' })
  @HttpCode(HttpStatus.OK)
  async updateContact(@Param('id') id: string, @Body() data: Contact): Promise<Contact> {
    return this.contactService.updateContact(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Contact' })
  @ApiResponse({ status: 209, description: 'Returns empty' })
  @HttpCode(HttpStatus.OK)
  async deleteContact(@Param('id') id: string): Promise<void> {
    await this.contactService.deleteContact(id);
  }

  @Post(':id/:groupId')
  async addContactToGroup(@Param('id') id: string, @Param('groupId') groupId: string): Promise<Contact> {
    try {
      const updatedContact = await this.contactService.addContactToGroup(id, groupId);
      return updatedContact;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Delete(':id/:groupId')
  async removeContactFromGroup(@Param('id') id: string, @Param('groupId') groupId: string): Promise<void> {
    await this.contactService.removeContactFromGroup(id, groupId);
  }
}
