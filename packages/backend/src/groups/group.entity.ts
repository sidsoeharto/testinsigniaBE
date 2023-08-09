import { Prisma } from '@prisma/client';

export class ContactGroup implements Prisma.ContactGroupCreateInput {
  id?: string;
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
  contactLists?: Prisma.ContactListCreateNestedManyWithoutContactGroupInput;
}

export type ContactData = {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
};

export type ContactGroupData = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  contacts: ContactData[];
};
