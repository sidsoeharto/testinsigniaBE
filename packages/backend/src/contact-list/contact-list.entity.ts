import { Prisma } from '@prisma/client';

export type ContactListData = {
  id: string;
  contactId: string;
  groupId: string;
};

export class ContactList implements Prisma.ContactListCreateInput {
  id?: string;
  contactId: string;
  groupId: string;
  contact: Prisma.ContactCreateNestedOneWithoutContactListsInput;
  contactGroup: Prisma.ContactGroupCreateNestedOneWithoutContactListsInput;
}
