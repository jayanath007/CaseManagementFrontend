export enum StatusType {
    Fail = 0,
    Success = 1
}

export enum ConflictCheckType {
    Matter = 'Matter',
    Client = 'Client',
    OpportunitySave = 'OpportunitySave',
    OpportunityQuote = 'OpportunityQuote',
    OpportunityConflictRun = 'OpportunityConflictRun',
}


export enum ConflictSaveType {
    Save = 'Save',
    SaveAndGotoNewItem = 'SaveAndGotoNewItem',
    SaveAndClose = 'SaveAndClose',
}

export enum ConflictSearchOpenFrom {
    MatterCreation = 'MATTER_CREATION',
    ClientCreation = 'CLIENT_CREATION',
    OpenCase = 'OPEN_CASE',
    OpportunitySave = 'OPPORTUNITY_SAVE',
    OpportunityQuote = 'OPPORTUNITY_QUOTE',
    OpportunityConflictRun = 'OPPORTUNITY_CONFLICT_RUN',
}
