import { IMainState, IVarValue } from './request';

export interface ScreenContanerComponent {
    varNo: number;
    containerName: string;
    containerXAxis: number;
    containerYAxis: number;
    containerHeight: number;
    containerWidth: number;
    isEditMode: boolean;
    searchField: boolean;
    mappedContactField: string;
    contanerLable: ControlInfo;
    control: ControlInfo;
    uiComponentType: UiComponentType;
    uiViewType: UiViewType;
    mainState: IMainState;
    isSelected: boolean;
    onContact?: boolean;
    sequence: number;
    // isNewItem?: boolean;
    isUploaded?: boolean;
    screenComponentDto?: ScreenComponentDto;
}


export enum SdDataSource {
    Vars = 0,
    Matters = 1,
    Clients = 2,
    Contacts = 3,
    Screen = 4
}

export interface ControlInfo {
    name: string;
    width?: number;
    height?: number;
    marginTop?: number;
    marginLeft?: number;
    backgroundColor?: string;
    fontWeight?: string;
    fontSize?: string;
    fontFamily?: string;
    color?: string;
    value?: string | number | boolean | Date;
    readonly?: boolean;
    isDirty?: boolean;
    maxLength?: number;
    enabale?: boolean;
    action?: string;
    tabindex?: number;
    options?: any;
    maskText?: string;
    multiLine?: boolean;
    helpText?: string;
    autofocus?: boolean;
}

export interface ScreenComponentDto {
    sC_ID?: number;
    sC_AppID?: number;
    sC_ScreenNo?: number;
    sC_VarNo?: number;
    sC_Action?: string;
    sC_Border?: boolean;
    sC_Enabled?: boolean;
    sC_Visible?: boolean;
    sC_Mask?: string;
    sC_Force?: boolean;
    sC_Left?: number;
    sC_Top?: number;
    sC_TextCol?: string;
    sC_BackCol?: string;
    sC_Height?: number;
    sC_Sequence?: number;
    sC_Multiline?: boolean;
    sC_Protected?: boolean;
    sC_Version?: number;
    sC_Search?: boolean;
    sC_TemplateLine?: string;
    avD_ID?: number;
    avD_AppID?: number;
    avD_VarNo?: number;
    avD_Type?: number;
    avD_Length?: number;
    avD_Text?: string;
    avD_Help?: string;
    sD_ContactType?: number;
    dM_CField?: string;
    dM_TPID?: string;
    // label_Width?: number;
    lookup_Text?: Array<string>;
    field_Value?: any;
    error_Message?: string;
    onScreen?: boolean;
    avD_TypeText?: string;
    onContact?: boolean;
    isNewItem?: boolean;
    PosCodeVarValues?: IVarValue[];
}

export enum UiViewType {
    VC_NORMAL = 0,
    VC_VIEWONLY = 1,
    VC_FORCED = 2,
    VC_PROTECTED = 3
}

export interface MaskValidateTextModel {
    inputText: string;
    isValid: boolean;
}

export enum UiComponentFontSize {
    NORMAL = 8.25,
    DISABILITY = 12
}


export enum UiComponentType {
    Text = 0,
    Date = 1,
    YesNo = 2,
    Label = 3,
    Combo = 4,
    Currency = 5,
    Integer = 6,
    Line = 7,
    Time = 8,
    PostCode= 9,
    CliAttachment = 10,
    MatAttachment = 11,
    AddressSearch  = 12
}


export const SCREEN_FIELD_TYPE_LIST = [
    { fieldTypeId: UiComponentType.Text, fieldTypeName: 'Text' },
    { fieldTypeId: UiComponentType.Date, fieldTypeName: 'Date' },
    { fieldTypeId: UiComponentType.YesNo, fieldTypeName: 'YesNo' },
    { fieldTypeId: UiComponentType.Combo, fieldTypeName: 'Combo' },
    { fieldTypeId: UiComponentType.Currency, fieldTypeName: 'Currency' },
    { fieldTypeId: UiComponentType.Integer, fieldTypeName: 'Integer' },
    { fieldTypeId: UiComponentType.Time, fieldTypeName: 'Time' },
    { fieldTypeId: UiComponentType.AddressSearch, fieldTypeName: 'Address Search' },
    { fieldTypeId: UiComponentType.PostCode, fieldTypeName: 'Post Code' },
    { fieldTypeId: UiComponentType.CliAttachment, fieldTypeName: 'Cli Attachment' },
    { fieldTypeId: UiComponentType.MatAttachment, fieldTypeName: 'Mat Attachment' },
  ];


