

export class GlobalSearchRequest {
    constructor(public searchDocumentViewModel: SearchDocumentViewModel
    ) { }

    public toPost() {
        return {
            srchDocumentViewModel: this.searchDocumentViewModel,
        };
    }
}


export interface SearchDocumentViewModel {
    Filter?: string;
    OrderBy?: Array<string>;
    Skip?: number;
    Top?: number;
    searchText: string;
}












