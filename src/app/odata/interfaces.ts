import { Logic, Operator, FieldType, SortDirections } from './enums';

export interface Filter<T> {
    logic?: Logic;
    filters: T[];
}

export interface Condition {
    field: string;
    operator: Operator | String;
    value?: string | Date | number;
    fieldType: FieldType;
}

export interface FieldSort {
    dir: SortDirections;
    field: string;
}

