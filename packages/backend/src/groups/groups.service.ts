import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { ContactGroup, ContactGroupData } from './group.entity';

@Injectable()
export class ContactGroupService {
  constructor(private readonly prisma: PrismaService) {}

  async createContactGroup(data: Prisma.ContactGroupCreateInput): Promise<ContactGroup> {
    this.validateContactGroupData(data);

    const createdContactGroup = await this.prisma.contactGroup.create({ data });
    return createdContactGroup;
  }

  async getAllContactGroups(): Promise<ContactGroupData[]> {
    const contactGroups = await this.prisma.contactGroup.findMany({
      include: {
        contactLists: {
          include: {
            contact: true,
          },
        },
      },
    });

    return contactGroups.map((group) => this.mapPrismaContactGroupToContactGroupData(group));
  }

  async getContactGroupById(contactGroupId: string): Promise<ContactGroup> {
    const contactGroup = await this.prisma.contactGroup.findUnique({ 
      where: { id: contactGroupId },
      include: {
        contactLists: {
          include: {
            contact: true,
          },
        },
      },
    });
    if (!contactGroup) {
      throw new NotFoundException('Contact group not found.');
    }
    
    return this.mapPrismaContactGroupToContactGroupData(contactGroup);
  }

  async updateContactGroup(
    contactGroupId: string,
    data: Prisma.ContactGroupUpdateInput,
  ): Promise<ContactGroup> {
    this.validateContactGroupData(data);

    const updatedContactGroup = await this.prisma.contactGroup.update({
      where: { id: contactGroupId },
      data,
    });
    return updatedContactGroup;
  }

  async deleteContactGroup(contactGroupId: string): Promise<ContactGroup> {
    const contactToDelete = await this.prisma.contact.findUnique({ where: { id: contactGroupId } });
    if (!contactToDelete) {
      throw new NotFoundException('Contact Group not found.');
    }

    const deletedContactGroup = await this.prisma.contactGroup.delete({ where: { id: contactGroupId } });
    return deletedContactGroup;
  }

  private validateContactGroupData(data: Prisma.ContactGroupUpdateInput): void {
    if (!data.name) {
      throw new BadRequestException('Name is required for the contact group.');
    }

    if (!data.description) {
      throw new BadRequestException('Description is required for the contact group.');
    }
  }

  private mapPrismaContactGroupToContactGroupData(contactGroup): ContactGroupData {
    return {
      id: contactGroup.id,
      name: contactGroup.name,
      description: contactGroup.description,
      createdAt: contactGroup.createdAt,
      updatedAt: contactGroup.updatedAt,
      contacts: contactGroup.contactLists.map((contactList) => ({
        id: contactList.contact.id,
        name: contactList.contact.name,
        phoneNumber: contactList.contact.phoneNumber,
        email: contactList.contact.email,
        address: contactList.contact.address,
      })),
    };
  }
}
