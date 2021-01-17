import { MatterInfo } from '../../core';
import { OpenFrom } from './enum';

export interface ContactCreateInputData {
    openfrom?: OpenFrom;
    matterInfo?: MatterInfo;
}

export class ContactViewModel {
    address1 = '';
    address2 = '';
    appId: 0;
    birthDate = '';
    branchId: number;
    companyDX = '';
    companyEmail = '';
    companyFax = '';
    companyId: number;
    companyName = '';
    companyPhone = '';
    companySpeciality = '';
    companyWeb = '';
    contactId: number;
    contactLinkId = '';
    contactRefValuesViewModel: any;
    contactRoleId: number;
    country = '';
    email1 = '';
    email2 = '';
    fileId: number;
    forename = '';
    gender = '';
    initial = '';
    isAddCompany = false;
    isCompanyDirty = false;
    isContactDirty = false;
    isContactRefDirty = false;
    isContactRoleDirty = false;
    isContactRoleVisible = false;
    letterTitle = '';
    matterRef = '';
    middleName = '';
    phoneEvening = '';
    phoneMobile = '';
    postCode = '';
    salutation = '';
    speciality = '';
    surName = '';
    title = '';
    town = '';
    typeId: number;
}

export interface ContactType {
    tP_ID: number;
    tP_Category: string;
    tP_Description: string;
    TP_BaseID?: number;
    conRefs_CR_ID: number[];
    aCT_ID: number;
    aCT_APID: number;
    aCT_TPID: number;
    aCT_SingleCon: boolean;
}

