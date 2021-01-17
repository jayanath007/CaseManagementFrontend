import { ColumnDef } from '../../core/lib/grid-model';
import { PageEvent } from '@angular/material';
import { Filter, Condition, FieldSort } from '../../odata/interfaces';
export interface ContactScreenItem {
  contactId: number;
  name?: string;
  company?: string;
  telephone?: string;
  email?: string;
  postCode?: string;
  address?: string;
  roleOnFile?: string;
  cT_General?: string;
  cT_Salutation?: string;
  cT_CompanyName?: string;
  cT_Address1?: string;
  cT_Address2?: string;
  cT_Town?: string;
  cT_County?: string;
  cT_PostCode?: string;
  cT_Telephone?: string;
  cT_JobDescription?: string;
  cT_Email?: string;
  cT_Title?: string;
  cT_Initials?: string;
  cT_Forename?: string;
  cT_Surname?: string;
  cT_DXNumber?: string;
  cT_DXArea?: string;
  cT_Telephone2?: string;
  cT_Telephone3?: string;
  cT_Fax?: string;
  cT_Email2?: string;
  cT_Speciality?: string;
  cT_Name?: string;
  cT_Introduction?: string;
  cT_Gender?: string;
  cT_Ethnic?: string;
  cT_MStat?: string;
  cT_Birth_Name?: string;
  cT_Birth_Place?: string;
  cT_BirthDate?: string;
  cT_OpenDate?: string;
  cT_FeeEarner?: string;
  cT_DisabMonitor?: string;
  cT_SIC_Code?: string;
  cT_Title2?: string;
  cT_MiddleNames?: string;
  cT_User1?: string;
  cT_User2?: string;
  cT_User3?: string;
  cT_User4?: string;
  cT_UserDate1?: string;
  cT_UserDate2?: string;
  cT_User5?: string;
  cT_User6?: string;
  cT_User7?: string;
  cT_User8?: string;
  cT_User9?: string;
  cT_User10?: string;
  cT_Details?: string;
  ctC_CompanyName?: string;
  ctC_Address1?: string;
  ctC_Address2?: string;
  ctC_Town?: string;
  cTC_County?: string;
  ctC_PostCode?: string;
  ctC_Email?: string;
  ctC_WebSite?: string;
  ctC_Telephone?: string;
  ctC_Fax?: string;
  ctC_Speciality?: string;
  ctC_DX?: string;
  ctC_SICSector?: string;
  ctC_Telephone2?: string;
  ctC_Misc1?: string;
  ctC_Misc2?: string;
  contactType?: string;
  salAccountRef: string;
  leadClientRef: string;
  isLeadClient: string;
}

// export interface MatterDetails {
//   appID: number;
//   branchID: number;
//   fileID: number;
//   clientRef?: string;
//   matterDetails?: string;
//   matterRef?: string;
// }

export interface UnlinkContactViewModel {
  dataSource: number;
  contactsTypeOnFile: number;
  currentContactID: number;
  currentContactMatterLinkID: number;
  contactLocked: boolean;
  contactType: number;
  hasRightsToAddContact: boolean;
  contactIs1to1: boolean;
  blockLoadVar: number;
  mustValidate: boolean;
  contactDefaultSearchFields: number;
  contactDirty: boolean;
  contactTypeDescription?: string;
  contactTypeBaseDescription?: string;
}

export interface ContactScreenItemWrapper extends ContactScreenItem {
  selected: boolean;
  delete: boolean;
  matterCount: number;
}

export interface ContactFieldDef extends ColumnDef {
  sC_ID?: number;
  contactField?: string;
  screenLabel?: string;
  showSearch: boolean;
  modified: boolean;
  checked: boolean;
  mappedField: boolean;
}

export interface DetailStatusViewModel {
  Code: string;
  Message: string;
  Reference: string;
  MessageType: string;
  SeverityLevel: string;
  ExceptionType: string;
}

export interface AggregatorViewModel {
  Field: string;
  Aggregate: string;
}

// export interface ScreenContactList {
//   data: ScreenContact[];
//   total: number;
// }
export interface ContactSearchResult {
  action: ContactSearchAction;
  selectedContactId?: number;
  searchType: ContactSearchType;
}

export enum ContactSearchType {
  All = 'ALL',
  FILE = 'FILE',
  FIELD = 'FIELD',
  CONFIGURE = 'CONFIGURE'
}

export enum ContactSearchAction {
  NewContact = 'NEW_CONTACT',
  ContactSelected = 'CONTACT_SELECTED',
  UserClosed = 'USER_CLOSED',
  OnSaveSearchFields = 'ON_SAVE_SEARCH_FIELDS'
}

export enum ContactToolBarAction {
  SearchAll = 'SEARCH_ALL',
  SearchOnFile = 'SEARCH_ON_FILE',
  ConfigSearch = 'CONFIG_SEARCH',
  SaveNewContact = 'SAVE_NEW_CONTACT',
  Clear = 'CLEAR',
  RemoveFromFile = 'REMOVE_FROM_FILE',
}

export interface ItemSelectionViewModel {
  id: number;
  isMultiSelection: boolean;
}

/*export interface ScreenContactListItem<T> {
  readonly data: T;
  readonly isExpand: boolean;
  readonly documentUrl?: string;
  readonly documentUrlIsLoading?: boolean;
  readonly documentUrlLoadSuccess?: boolean;
}*/

// export type ContactItemWrapper = ScreenContactListItem<Readonly<ScreenContact>>;

