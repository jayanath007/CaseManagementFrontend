export interface ScreenEditMetaItem {
    SCL_ID: number;
    SCL_Name: string;
    SCL_Caption: string;
    SCL_DefaultCaption: string;
    SCL_Visible: boolean;
    SCL_Type: number;
    SCL_Required: boolean;
    SCL_MinLength: number;
    SCL_IsTab: boolean;
    SCL_ReadOnly: boolean;
    CL_ParentID: number;
    SCL_DisplayOrder: number;
    SCL_System: boolean;
    Children: ScreenEditMetaItem[];
}
export interface DpsScreenInputScope {
    metaId: string;
    meta: ScreenEditMetaItem;
    dataSource: any;
    metaLinker(): any;
   // metaWatcher: any;
    onBlur();
}
