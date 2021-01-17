import { Filter, Operator, Logic, FieldType, Condition, FieldSort } from '../../odata';

export interface ColumnDef {
    filterActive: boolean;
    filter: Filter<Condition>;
    fieldName: string;
    extras?: any;
    sort?: FieldSort;
    visible?: boolean;
}

export interface PaginatorDef {
    currentPage: number;
    itemPerPage: number;
    total?: number;
}

export interface DataSourceRequestViewModel {
    take: number;
    skip: number;
    sort?: Array<FieldSort>;
    filter?: any;
    aggregators?: Array<AggregatorViewModel>;
    group?: any[];
}

export interface AggregatorViewModel {
    field: string;
    aggregate: string;
}

export interface GroupfilterValue {
    operator: string;
    value: string;
}

export interface GridGroupData {
    aggregates: string;
    count: number;
    filterValue: string;
    hasSubgroups: boolean;
    selectorField: string;
    value: string;
    items: GridGroupData[];
    groupHash?: string;
    perentfilterValue: string;
    select?: boolean;
    currentItems?: number;
}


