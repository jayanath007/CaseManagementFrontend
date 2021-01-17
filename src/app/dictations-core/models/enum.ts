import { GridRowData } from './interface';


export enum GridRowButtonType {
    OpenDictationPlayer = 'DICTATIONS_AUDIO_PLAYER',
    ViewDocument = 'VIEW_DOCUMENT',
    JobCompleted = 'JOB_COMPLETED',
    CheckingFor = 'CHECKING_FOR',
    AttachedMatter = 'ATTACHED_MATTER',
}

export interface GridButtonAction {
    kind: GridRowButtonType;
    value: GridRowData;
    menuInfo?: any;

}

export enum UserType {
    typist = 3,
    author = 6,
    manager = 9,
}



export enum JobFolderType {
    NewJob = 0,
    Sent = 20,
    ToAmend = 25,
    ToDo = 20,
    AutherDraft = 10,
    TypistDrafts = 30,
    ToPrint = 50,
    Completed = 60,
    Transcribed = 40,
    Approved = 50,
    ToCheck = 40,
}


export enum UrgentValue {
    normal = 1,
    important = 2,
    urgent = 3

}



