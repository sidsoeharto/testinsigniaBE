import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { Contact, ContactData } from './contact.entity';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllContacts(): Promise<ContactData[]> {
    const contacts = await this.prisma.contact.findMany({
      include: {
        contactLists: {
          include: {
            contactGroup: true,
          },
        },
      }}
    );

    return contacts.map((contact) => this.mapPrismaContactToContactData(contact));
  }

  async getContactById(id: string): Promise<ContactData> {
    const contact = await this.prisma.contact.findUnique({ 
      where: { id },
      include: {
        contactLists: {
          include: {
            contactGroup: true,
          },
        },
      },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    return this.mapPrismaContactToContactData(contact);
  }

  async createContact(data: Prisma.ContactCreateInput): Promise<Contact> {
    this.validateContactData(data);

    try {
      const createdContact = await this.prisma.contact.create({ data });
      return createdContact;
    } catch (error) {
      throw new BadRequestException('Failed to create contact.');
    }
  }
  
  async updateContact(id: string, data: Prisma.ContactCreateInput): Promise<Contact> {
    this.validateContactData(data);
    
    try {
      const updatedContact = await this.prisma.contact.update({ where: { id }, data });
      return updatedContact;
    } catch (error) {
      throw new BadRequestException('Failed to update contact.');
    }
  }
  
  async deleteContact(id: string): Promise<void> {
    const contactToDelete = await this.prisma.contact.findUnique({ where: { id: id } });
    if (!contactToDelete) {
      throw new NotFoundException('Contact not found.');
    }

    await this.prisma.contact.delete({ where: { id } });
  }

  async addContactToGroup(contactId: string, groupId: string): Promise<Contact> {
    const [contact, group] = await Promise.all([
      this.prisma.contact.findUnique({ where: { id: contactId } }),
      this.prisma.contactGroup.findUnique({ where: { id: groupId } }),
    ]);
  
    if (!contact || !group) {
      throw new NotFoundException('Contact or group not found.');
    }

    const isContactInGroup = await this.prisma.contactList.findFirst({
      where: { contactId, groupId },
    });
  
    if (isContactInGroup) {
      throw new ConflictException(`Contact with ID ${contactId} is already associated with Group with ID ${groupId}.`);
    }
  
    await this.prisma.contactList.create({
      data: {
        contact: { connect: { id: contactId } },
        contactGroup: { connect: { id: groupId } },
      },
    });

    const updatedContact = await this.prisma.contact.findUnique({
      where: { id: contactId },
      include: { contactLists: { include: { contactGroup: true } } },
    });
  
    return this.mapPrismaContactToContactData(updatedContact);
  }

  async removeContactFromGroup(contactId: string, groupId: string): Promise<void> {
    const contactListToDelete = await this.prisma.contactList.findFirst({ where: {
      contactId,
      groupId,
    }});

    if (!contactListToDelete) {
      throw new NotFoundException('Contact List not found.');
    }

    await this.prisma.contactList.deleteMany({
      where: {
        contactId,
        groupId,
      },
    });
  }

  private validateContactData(data: Prisma.ContactCreateInput): void {
    if (!data.name) {
      throw new BadRequestException('Name is required.');
    }
    if (!data.workspaceId) {
      throw new BadRequestException('Workspace ID is required');
    }
    if (!data.phoneNumber) {
      throw new BadRequestException('Phone number is required.');
    }
    if (!/^(\+?\d{1,3}[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/.test(data.phoneNumber)) {
      throw new BadRequestException('Invalid phone number format.');
    }
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new BadRequestException('Invalid email format.');
    }
    if (!data.address) {
      throw new BadRequestException('Address is required');
    }
  }

  private mapPrismaContactToContactData(contact: any): ContactData {
    return {
      id: contact.id,
      workspaceId: contact.workspaceId,
      name: contact.name,
      phoneNumber: contact.phoneNumber,
      email: contact.email,
      address: contact.address,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
      contactGroups: contact.contactLists.map((contactList) => {
        return {
          id: contactList.contactGroup.id,
          name: contactList.contactGroup.name,
          description: contactList.contactGroup.description,
        };
      }),
    };
  }
}
