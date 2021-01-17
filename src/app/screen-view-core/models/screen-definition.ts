import { IMainState } from './request';

export interface ScreenDefinitionDto {
    // (SP):-> respective field in the 'Screen Parameters' screen of 'OneOffice'
    sD_ID: number;              // (SP): Screen Number
    sD_AppID: number;
    sD_Number: number;
    sD_Title: string;           // (SP): Screen Title
    sD_DataSource: number;      //  (SP): Load From
    sD_ContactType: number;     // (SP): Contact Type
    sD_BlockLoadVar: number;
    sD_ContactSearchOptions: number;
    sD_ContactLocked: boolean;  // (SP): Locked
    sD_MustValidate: boolean;   // (SP): Must Validate
    acT_SingleCon: boolean;     // (SP): One Only Per Matter
    screenContactTypes?: Array<ScreenContactTypeDto>;
    screenContactFieldTypes?: Array<ScreenContactFieldTypeDto>;
    appPrefix: string;
    screenDefType?: EnumScreenDefType;
    contactTypeDescription: string;
    contactTypeBaseDescription: string;
}


export interface IScreenDefinitionForValidation {
    // Properties
    screenTitle: string;
    id: number;
    screenNumber: number;
    mustValidate: boolean;
    dataSource: number;
    contactType: number;
    locked: boolean;
    oneOnlyPerMatter: boolean;
    ScreenDefType?: EnumScreenDefType;
    ContactTypeDescription: string;
    ContactTypeBaseDescription: string;

}

export interface ScreenContactTypeDto {
    tP_ID: number;
    tP_Category: string;
    tP_Description: string;
    tP_BaseID: number;
    conRefs_CR_ID: Array<number>;
    acT_ID: number;
    acT_APID: number;
    acT_TPID: number;
    acT_SingleCon: boolean;
}

export interface ScreenContactFieldTypeDto {
    id: number;
    name: string;
    description1: string;
}

export enum EnumScreenDefType {
    File = 0,
    SQL = 1,
    NotFound = 2
}
export class IScreenDefinition {
    // Properties
    screenTitle: string;
    id: number;
    screenNumber: number;
    mustValidate: boolean;
    dataSource: number;
    contactType: number;
    locked: boolean;
    oneOnlyPerMatter: boolean;
    screenDefinitionDto: ScreenDefinitionDto;
    screenContactTypes?: Array<ScreenContactTypeDto>;
    screenContactFieldTypes?: Array<ScreenContactFieldTypeDto>;
    ScreenDefType?: EnumScreenDefType;
    ContactTypeDescription: string;
    ContactTypeBaseDescription: string;

}

export class ScreenDefinition implements IScreenDefinition {


    id: number;
    screenNumber: number;
    screenTitle: string;
    screenEditTitle: string;
    application: string;
    applicationWithPrefix: string;
    mustValidate: boolean;
    dataSource: number;
    contactType: number;
    locked: boolean;
    oneOnlyPerMatter: boolean;
    screenContactTypes: Array<ScreenContactTypeDto>;
    screenContactFieldTypes: Array<ScreenContactFieldTypeDto>;
    ScreenDefType?: EnumScreenDefType;
    ContactTypeDescription: string;
    ContactTypeBaseDescription: string;


    constructor(public screenDefinitionDto: ScreenDefinitionDto, public mainState: IMainState) {
        // screenDefinitionDto.sD_Title;
        this.screenNumber = screenDefinitionDto.sD_Number;
        this.id = screenDefinitionDto.sD_ID;
        this.application = screenDefinitionDto.sD_AppID.toString(); // ToDo: Get name
        // ToDo: Get name with prefix
        this.applicationWithPrefix = screenDefinitionDto.sD_AppID.toString() + ' | ' + screenDefinitionDto.appPrefix.toString();
        this.mustValidate = screenDefinitionDto.sD_MustValidate;
        this.dataSource = screenDefinitionDto.sD_DataSource;
        this.contactType = screenDefinitionDto.sD_ContactType;
        this.locked = screenDefinitionDto.sD_ContactLocked;
        this.oneOnlyPerMatter = screenDefinitionDto.acT_SingleCon;
        this.screenContactTypes = screenDefinitionDto.screenContactTypes;
        this.screenContactFieldTypes = screenDefinitionDto.screenContactFieldTypes;
        this.ScreenDefType = screenDefinitionDto.screenDefType;
        this.ContactTypeDescription = screenDefinitionDto.contactTypeDescription;
        this.ContactTypeBaseDescription = screenDefinitionDto.contactTypeBaseDescription;
        this.screenTitle = this.setScreenTitle();
        this.screenEditTitle = screenDefinitionDto.sD_Title;

    }

    setScreenTitle() {
        let title: string;
        if (this.screenDefinitionDto) {
            // Include screen number and title (Only if avaliable) to caption
            if (this.screenDefinitionDto.sD_Number) {
                title = '[' + this.screenDefinitionDto.sD_Number + '] ';

                if (this.screenDefinitionDto.sD_Title) {
                    title += this.screenDefinitionDto.sD_Title;
                }
            }
            // Include contact related information (Only if avaliable) to caption
            if (this.dataSource === 3 && this.contactType > 0 && this.screenContactTypes) {
                const screenContactType: ScreenContactTypeDto = this.screenContactTypes
                    .filter((item) => item.tP_ID === this.contactType)[0];
                if (screenContactType) { title += ' - linked to ' + screenContactType.tP_Description; }
                title += this.oneOnlyPerMatter ? ' (One Allowed)' : ' (Many Allowed)';
            }
        }
        return title;
    }

    setMustValidate(mustValidate) {
        this.mustValidate = mustValidate;
        this.screenDefinitionDto.sD_MustValidate = mustValidate;
    }
    setScreenTitleDefinition(screenEditTitle) {
        this.screenEditTitle = screenEditTitle;
        this.screenDefinitionDto.sD_Title = screenEditTitle;
        this.screenTitle = this.setScreenTitle();
    }
    setDataSource(dataSource) {
        this.dataSource = dataSource;
        this.screenDefinitionDto.sD_DataSource = dataSource;
    }

    setContactType(contactType) {
        this.contactType = contactType;
        this.screenDefinitionDto.sD_ContactType = contactType;
    }

    setLocked(locked) {
        this.locked = locked;
        this.screenDefinitionDto.sD_ContactLocked = locked;
    }

    setOneOnlyPerMatter(oneOnlyPerMatter) {
        this.oneOnlyPerMatter = oneOnlyPerMatter;
        this.screenDefinitionDto.acT_SingleCon = oneOnlyPerMatter;
    }
}

export enum ScreenDesignFormActions {
    ShowContactSearchWithActor,
    EnableUpdateContact,
    SetScreenControlValueIsDirty,
    RunTabLogic,
    UfnUpdate,
    CliAttachmentUpload = 'CliAttachment',
    MatAttachmentUpload= 'MatAttachment',
}

export enum FileLocation {
    Cloud= 'Cloud',
    Client= 'Client',
}



