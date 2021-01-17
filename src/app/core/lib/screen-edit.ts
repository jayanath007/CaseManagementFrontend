
export enum Mode {
    AddMode = 'Add Mode',
    SearchMode = 'Search Mode',
    EditMode = 'Edit Mode'
}
export interface DropdownListData {
    key: number | string;
    value: string;
    description1?: string;
    description2?: string;
}
export interface ScreenEditComponentTreeData {
    scL_ID: number;
    scL_SCT_ID: number;
    scL_Name: string;
    scL_Caption: string;
    scL_DefaultCaption: string;
    scL_Visible: boolean;
    scL_Type: number;
    scL_Required: boolean;
    scL_MinLength: number;
    scL_IsTab: boolean;
    scL_ReadOnly: boolean;
    scL_ParentID: number;
    scL_DisplayOrder: number;
    scL_System?: boolean;
    children?: ScreenEditComponentTreeData[];
    expanded?: boolean;
}
export interface LookupList {
    luP_Code: string;
    luP_Description: string;
    luP_Hidden: boolean;
    luP_ID: number;
    luP_LUTID: number;
    luP_LookupID: any;
    luP_VariantValue: any;
    lookupType_LUT_ID: number;
    isDirty?: boolean;
    isDelete?: boolean;
}
export interface LookupViewModel {
    luT_Description: string;
    luT_ID: number;
    luT_Type: string;
    luT_VariantLabel: any;
    lookupViewModels: LookupList[];
}
export interface MatClientRefViewModel {
    UseClientNumber: boolean;
    NextClientNumber: number;
    NumsClient: number;
    CharsClient: number;
    UseMatterNumber: false;
    NextMatterNumber: number;
    NumsMatter: number;
}

export interface SelectedLookupViewModel {
    luT_Description: string;
    luT_ID: number;
    luT_Type: string;
    luT_VariantLabel: any;
}
export class ScreenLayoutRequestViewModel {
    constructor(public model: any) { }

    public toPost() {
        return this.model;
    }

}



