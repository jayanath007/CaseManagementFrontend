
import { Filter, Condition, FieldSort } from '../../odata/interfaces';

export class GeneralSearchRequest {
    constructor(public SearchTxt: string, public sitePath: string, public isFrontEndFilter: boolean,
        public dataSourceInfo: DataSourceRequestViewModel) { }

    public toPost() {
        return { dataSourceRequestViewModel: this.dataSourceInfo, searchText: this.SearchTxt };
    }
}



export interface DataSourceRequestViewModel {
    Take: number;
    Skip: number;
    Sort?: Array<FieldSort>;
    Filter?: Filter<Filter<Condition>> | Filter<Condition>;
    Aggregators?: Array<AggregatorViewModel>;
}



export interface AggregatorViewModel {
    field: string;
    aggregate: string;
}

