import { Prisma } from '@prisma/client';

export class Contact implements Prisma.ContactCreateInput {
  id?: string;
  workspaceId: string;
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  createdAt?: Date;
  updatedAt?: Date;
  contactLists?: Prisma.ContactListCreateNestedManyWithoutContactInput;
}

export type ContactListData = {
  id: string;
  name: string;
  description: string;
};

export type ContactData = {
  id: string;
  workspaceId: string;
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  contactGroups: ContactListData[];
};