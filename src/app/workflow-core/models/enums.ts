
export enum MessageTypes {
    InternalPreStart = 'InternalPreStart',
    ShowUserScreen = 'ShowUserScreen',
    ShowOptionDialogBox = 'ShowOptionDialogBox',
    ShowMessageBox = 'ShowMessageBox',
    ShowListLetterScreen = 'ShowListLetterScreen',
    ShowListLetterSaveButton = 'ShowListLetterSaveButtonRequest',
    ShowEmailRequest = 'ShowEmailRequest',
    PlotSyncScreenRequest = 'PlotSyncScreenRequest',
    ShowXMmenu = 'ShowXMmenu',
    ShowInputBox = 'ShowInputBox',
    ShowPostCodeMatchingPopup = 'ShowPostCodeMatchingPopup',
    SessionComplete = 'SessionComplete',
    WorkerReady = 'WorkerReady',
    SaveToDiaryConfirmation = 'SaveToDiaryConfirmation',
    LoadWebPage = 'LoadWebPage',
    UpdateClientState = 'UpdateClientState',
    ScreenNavigationFail = 'ScreenNavigationFail',
    CloseUserScreen = 'CloseUserScreen',
    FocusCurrentUserScreen = 'FocusCurrentUserScreen',
    ContactSavedAcknowledge = 'ContactSavedAcknowledge',
    ContactLinkedAcknowledge = 'ContactLinkedAcknowledge',
    ScreenStateChange = 'ScreenStateChange',
    ViewDocument = 'ViewDocument',
    ShowDiaryScreen = 'ShowDiaryScreen',
    ShowEChitScreenRequest = 'showEChitScreenRequest',
    LoadPdfViewer = 'LoadPdfViewerRequest',
    ShowContactSearchScreen = 'ShowContactSearchScreen',
    ShowContactSearchScreenOnFile = 'ShowContactSearchScreenOnFile',
    ShowShareScreenRequest = 'ShowShareScreenRequest',
    CDS7ReportDialogBox = 'CDS7ReportDialogBox'
}

export enum MessageBoxButtons {
    Ok = 'OK',
    OkCancel = 'OKCancel',
    AbortRetryIgnore = 'AbortRetryIgnore',
    YesNoCancel = 'YesNoCancel',
    YesNo = 'YesNo',
    RetryCancel = 'RetryCancel',
    ContactMatterCancel = 'ContactMatterCancel',
    ReloadUnlink = 'ReloadUnlink'
}

export enum MessageBoxIcon {
    None = 'None',
    Error = 'Error',
    Hand = 'Hand',
    Stop = 'Stop',
    Question = 'Question',
    Exclamation = 'Exclamation',
    Warning = 'Warning',
    Asterisk = 'Asterisk',
    Information = 'Information',
}

export enum DialogResult {
    None = 'None',
    Ok = 'OK',
    Cancel = 'Cancel',
    Abort = 'Abort',
    Retry = 'Retry',
    Ignore = 'Ignore',
    Yes = 'Yes',
    No = 'No',
    Contact = 'Contact',
    Matter = 'Matter',
    Reload = 'Reload',
    Unlink = 'Unlink'
}

export enum ReturnCode {
    Fail = 'Fail',
    Ok = 'OK',
    Abort = 'Abort',
}

export enum UserScreenCommand {
    NextScreen = 'NextScreen',
    PreviousScreen = 'PreviousScreen',
    Exit = 'Exit',
    TabLogic = 'TabLogic',
    SearchContacts = 'SearchContacts',
    SearchContactsOnFile = 'SearchContactsFile',
    SaveNewContact = 'SaveContact',
    PlotSync = 'PlotSync'
}

export enum ScreenStateKind {
    UnlinkedContact = 'UNLINKED_CONTACT'
}

export enum SessionTypes {
    Templete = 'TEMPLATE',
    Screen = 'SCREEN',
    FileLogic = 'FILE_LOGIC'
}


export enum FileLogicTypes {
    EntryLogic = 'FILE_ENTRY_LOGIC',
    ExitLogic = 'FILE_EXIT_LOGIC'
}

export enum FileLogicStatus {
    NotStarted = 2,
    Started = 4,
    // tslint:disable-next-line:no-bitwise
    Completed = Started | 8,
    // tslint:disable-next-line:no-bitwise
    Success = Completed | 16,
    // tslint:disable-next-line:no-bitwise
    Faild = Completed | 32
}
