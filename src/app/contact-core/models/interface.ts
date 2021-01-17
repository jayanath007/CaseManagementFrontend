import { PageEvent } from '@angular/material';


export interface Contact {
  contactId: number;
  name: string;
  company: string;
  telephone?: string;
  email: string;
  postCode?: string;
  address: string;
  roleOnFile: string;
  CT_General?: string;
  CT_Salutation?: string;
  CT_CompanyName?: string;
  CT_Address1?: string;
  CT_Address2?: string;
  CT_Town?: string;
  CT_County?: string;
  CT_PostCode?: string;
  CT_Telephone?: string;
  CT_JobDescription?: string;
  CT_Email?: string;
  CT_Title?: string;
  CT_Initials?: string;
  CT_Forename?: string;
  CT_Surname?: string;
  CT_DXNumber?: string;
  CT_DXArea?: string;
  CT_Telephone2?: string;
  CT_Telephone3?: string;
  CT_Fax?: string;
  CT_Email2?: string;
  CT_Speciality?: string;
  CT_Name?: string;
  CT_Introduction?: string;
  CT_Gender?: string;
  CT_Ethnic?: string;
  CT_MStat?: string;
  CT_Birth_Name?: string;
  CT_Birth_Place?: string;
  CT_BirthDate?: string;
  CT_OpenDate?: string;
  CT_FeeEarner?: string;
  CT_DisabMonitor?: string;
  CT_SIC_Code?: string;
  CT_Title2?: string;
  CT_MiddleNames?: string;
  CT_User1?: string;
  CT_User2?: string;
  CT_User3?: string;
  CT_User4?: string;
  CT_UserDate1?: string;
  CT_UserDate2?: string;
  CT_User5?: string;
  CT_User6?: string;
  CT_User7?: string;
  CT_User8?: string;
  CT_User9?: string;
  CT_User10?: string;
  CT_Details?: string;
  CTC_CompanyName?: string;
  CTC_Address1?: string;
  CTC_Address2?: string;
  CTC_Town?: string;
  CTC_County?: string;
  CTC_PostCode?: string;
  CTC_Email?: string;
  CTC_WebSite?: string;
  CTC_Telephone?: string;
  CTC_Fax?: string;
  CTC_Speciality?: string;
  CTC_DX?: string;
  CTC_SICSector?: string;
  CTC_Telephone2?: string;
  CTC_Misc1?: string;
  CTC_Misc2?: string;
  ContactType?: string;
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

export interface ContactList {
  Data: Contact[];
  Total: number;
}

export interface ContactResponse {
  Data: ContactList;
  Aggregates: Array<AggregatorViewModel>;
  Status: string;
  MessageBody: string;
  MessageHeader: string;
  DetailStatus: DetailStatusViewModel[];
}


export interface ContactListItem<ContactDataItem> {
  readonly data: ContactDataItem;
  readonly isExpand: boolean;
  readonly documentUrl?: string;
}

export type ContactItemWrapper = ContactListItem<Readonly<Contact>>;

