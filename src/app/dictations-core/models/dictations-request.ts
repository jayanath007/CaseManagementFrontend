

export class DictaionsRequest {
    constructor(public dictaionsViewModel: DictaionsViewModel
    ) { }

    public toPost() {
        return {
            srchDocumentViewModel: this.dictaionsViewModel,
        };
    }
}


export interface DictaionsViewModel {
    Filter?: string;
    OrderBy?: Array<string>;
    Skip?: number;
    Top?: number;
    searchText: string;
}








