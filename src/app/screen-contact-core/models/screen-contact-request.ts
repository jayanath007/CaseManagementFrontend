import { ContactScreenItemWrapper, ContactFieldDef } from './interface';
import { ContactScreenItem } from './interface';
import { Filter, Condition, FieldSort } from '../../odata/interfaces';

export class GetSearchFieldsRequest {
    constructor(private appId: string, private screenId: string) {}

    // 'appId=5&screenId=004'
    public queryString() {
        return `appId=${this.appId}&screenId=${this.screenId}`;
    }
}

export class SearchAllContactsRequest {
    constructor(private contactTypeId: string, private count: string, private searchField: string, private searchKeyword: string) { }
    // 'contactTypeId=104'
    public queryString() {
        let searchFieldValue = '';
        if (this.searchField) {
            searchFieldValue = this.searchField;
        }
        let searchKeywordVal = '';
        if (this.searchKeyword) {
            searchKeywordVal = this.searchKeyword;
        }
        return `contactTypeId=${this.contactTypeId}&count=${this.count}` +
        `&searchField=${searchFieldValue}&searchKeyword=${searchKeywordVal}`;
    }
}

export class SearchFileContactsRequest {
    constructor(private appId: string, private branchId: string, private contactTypeId: string,
         private count: string, private fileId: string, private screenId: string, private searchKeyword: string) {}
    // 'appId=5&branchId=1&contactTypeId=104&count=500&fileId=9640&screenId=004'
    public queryString() {
        let searchKeywordVal = '';
        if (this.searchKeyword) {
            searchKeywordVal = this.searchKeyword;
        }
        return `appId=${this.appId}&branchId=${this.branchId}&contactTypeId=${this.contactTypeId}&count=${this.count}`
        + `&fileId=${this.fileId}&screenId=${this.screenId}&searchKeyword=${searchKeywordVal}`;
    }
}

export class MattersForContactRequest {
    constructor(public contactId: string) {}
    public queryString() {
        return `contactId=${this.contactId}`;
    }
}

export class DeleteContactRequest {
    constructor(private contacts: ContactScreenItemWrapper[]) {}
    public queryString() {
        const contactIdList =  this.contacts.map(contact => contact.contactId);
        const count = contactIdList.length;
        return contactIdList.reduce((queryStr, contactId, index) => {
            // append & to query string only if current id is not the last
            queryStr = `contactIdList=${contactId}${(index < (count - 1)) ? '&' : ''}`;
            return queryStr;
        }, '');
    }
}

export class RemoveContactFromFileRequest {
    constructor(private appId: string, private branchId: string,
        private fileId: string, private roleID: string, private contacts: ContactScreenItemWrapper[]) {}
    public toPost() {
        const contactIdList =  this.contacts.map(contact => contact.contactId);
        const matterVM = {
            AppId: this.appId,
            FileId: this.fileId,
            BranchId: this.branchId
        };
        return {
            CaseFileIdentityWithAppIdDto: matterVM,
            ContactIds: contactIdList,
            RoleId: this.roleID
        };
    }
}

export class UnlinkContactRequest {
    constructor(private appId: string, private fileId: string, private branchId: string, private contactType: string, 
        private contactId: string) {}
        public queryString() {
            return `appId=${this.appId}&branchId=${this.branchId}&contactId=${this.contactId}
            &contactType=${this.contactType}&fileId=${this.fileId}`;
        }
}

export class SaveContactSearchFieldsRequest {
    constructor(private appId: string, private screenId: string,
        private defaultFields: ContactFieldDef[], private mappedFields: ContactFieldDef[]) { }

    public toPost() {
        return {
            appId: this.appId,
            screenId: this.screenId,
            contactSearchFieldsViewModel: {
                DefaultContactFields: this.defaultFields,
                MappedContactFields: this.mappedFields
            }
        };
    }
}

export interface ScreenContactFilterOptionViewModel {
    ContactTypeId: number;
    Count: number; // paging not implemented in the service
    SearchField?: string;
    SearchKeyWord?: string;
}

export interface DataSourceRequestViewModel {
    take: number;
    skip: number;
    sort?: Array<FieldSort>;
    filter?: Filter<Filter<Condition>> | Filter<Condition>;
    aggregators?: Array<AggregatorViewModel>;
}


export interface SortViewModel {
    Field: string;
    Dir: string;
}
export interface FilterViewModel {
    Field: string;
    Operator: string;
    Value: object;
    Logic: string;
    Filters: Array<FilterViewModel>;
}

export interface AggregatorViewModel {
    Field: string;
    Aggregate: string;
}


