export enum DiaryRecType {
    NOT_TASK = 0,
    FILE_NOTE = 1,
    CALL_IN = 2,
    LETTER_IN = 3,
    TASK = 4,
    CALL_OUT = 5,
    LETTER_OUT = 6,
    KEY_EVENT = 7,
    DISBS = 8,
    VOICE_NOTE = 9,
    EMAIL_IN = 10,
    EMAIL_OUT = 11,
    TIME1 = 12,
    TIME2 = 13,
    TIME3 = 14,
    TIME4 = 15,
    TIME5 = 16,
    MILEAGE = 20,
    BOOKINGS = 21,
    MESSAGE_IN = 22,
    MESSAGE_OUT = 23
}

export enum DiaryRecordByType {
    LocalFile = 'LocalFile',
    PersonalFolder = 'PersonalFolder',
    DPSDocumentWithDiaryId = 'DPSDocumentWithDiaryId',
    DPSDocumentWithOutDiaryId = 'DPSDocumentWithOutDiaryId',
    PostOfficeFile = 'PostOfficeFile',
    CopyDiaryItem = 'CopyDiaryItem'
}

export enum LegalAid {
    NotLegalAid = 0,
    Crime = 1,
    ActionsAgainstPolice = 2,
    ClinicalNegligence = 3,
    CommunityCare = 4,
    ConsumerGeneralContract = 5,
    Debt = 6,
    Education = 7,
    Employment = 8,
    FamilyPrivate = 9,
    FamilyPublic = 10,
    Housing = 11,
    Miscellaneous = 12,
    PersonalInjury = 13,
    PublicLaw = 14,
    WelfareBenefits = 15,
}

export enum StatusType {
    Fail = 0,
    Success = 1
}

export enum SubmitType {
    NewMailOnly = 'NewMailOnly',
    Submit = 'Submit',
    Share = 'Share',
    SignAndShare = 'SignAndShare',
    SafeBoxSheare = 'SafeBoxSheare',
    WorkflowShare = 'WorkflowShare', // when screen loaded by LE for PQ command
    MsgViaMLS = 'MsgViaMLS'
}
export enum CheckedType {
    All = 'All',
    Single = 'Single',
}

