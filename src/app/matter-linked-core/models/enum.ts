import { Logic, Operator, FieldType, SortDirections } from './../../odata/enums';

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

export enum MatterLinkedType {
    WorkFlow = 'WORK_FLOW',
    AddNote = 'ADD_NOTE',
    MatterCreation = 'MATTER_CREATION',
    OpenCase = 'OPEN_CASE',
    Chaser = 'CHASER',
}


