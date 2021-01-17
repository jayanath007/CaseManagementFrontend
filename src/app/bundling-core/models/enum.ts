export enum OptionPageNoLoaction {
    none = 'None',
    topMiddle = 'Top Middle Of Page',
    topRight = 'Top Right Of Page',
    bottomMiddle = 'Bottom Middle Of Page',
    bottomRight = 'Bottom Right Of Page'
}
export enum ViewKind {
    applyColumnFilter = 'COLUMN_FILTER',
    clearFilter = 'CLEAR_BUNDLE_FILTER',
    toggleFieldSort = 'FIELD_SORT',
    pageChange = 'PAGE_CHANGE',
    periodColumnFilter = 'PERIOD_COLUMN_FILTER',
    searchText = 'BUNDLE_SEARCH_TEXT'
}

export enum BundleSaveSuccessMsg {
    Title = 'Success',
    SaveMsg = 'Data have been saved.',
    SaveWithProcessMsg = 'Your bundle has been scheduled.'
}

export enum ValidationMessage {
    DragDropMsg = 'Validating dropped items...',
    SaveMsg = 'Save data processing...',
    LoadingMsg = 'Data Loading...',
    UploadMsg = 'Uploading...',
}

export enum ItemRequest {
    ItemCount = 50
}
