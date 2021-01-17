export enum MenuNodeStatus {
    Hidden = 0,
    NotChange = 1,
    Disabled = 2
}
export enum MenuExportFileType {
    AllMenu = <any>'AllMenus',
    FirstLevel = <any>'FirstLevel',
    Other = <any>'Other'
}
export enum ItemChangeKind {
    RowEdit = 'ROW_EDIT',
    RowRightClick = 'ROW_RIGHTCLICK',
    RowSelected = 'ROW_SELECTED',
    RowNodeExpand = 'ROW_NODE_EXPAND',
    RowEnter = 'ROW_ENTER',

    EditDescriptionUpdate = 'EDIT_DESCRIPTION_UPDATE',
    EditTypeUpdate = 'EDIT_TYPE_UPDATE',
    EditCommandUpdate = 'EDIT_COMMAND_UPDATE',

    AddItemAbove = 'ADD_ITEM_ABOVE',
    AddItemBelow = 'ADD_ITEM_BELOW',
    AddMenuAbove = 'ADD_Menu_ABOVE',
    AddMenuBelow = 'ADD_Menu_BELOW',

    CutItem = 'CUT_ITEM',
    CopyItem = 'COPY_ITEM',
    PaseteItem = 'PASETE_ITEM',
    DeleteItem = 'DELETE_ITEM',

    BackwardMenuPath = 'BACKWARD_PATH',
    ForwardMenuPath = 'FORWARD_PATH',
    MenuDragItem = 'MENU_DRAG_ITEM',

    RunWorkFlow = 'RUN_WORKFLOW',
    editTemplate = 'EDIT_TEMPLATE',
    downloadTemplate = 'DOWNLOAD_TEMPLATE'
}
export enum ItemDragTo {
    Position = 'POSITION',
    Into = 'INTO'
}
export enum MatDialogMessage {
    title = 'Message',
    message = 'The item has been disabled by Workflow rules.\n It cannot be opened.'
}
export enum ImportButtonType {
    FullMenuAbove = 'FullMenuAbove',
    FullMenuBelow = 'FullMenuBelow',
    ChildMenu = 'ChildMenu'
}


