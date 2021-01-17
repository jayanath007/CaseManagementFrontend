import { map } from 'rxjs/operators';

import { Filter, Operator, Logic, FieldType, Condition, SortDirections } from '../../odata';
import { ColumnDef, PaginatorDef, GroupfilterValue, GridGroupData } from './grid-model';

export const getDefualtFilter = (fieldName, fieldType) => ({
  logic: Logic.And,
  filters: [
    { field: fieldName, fieldType: fieldType, operator: Operator.EqualTo, value: '' },
    { field: fieldName, fieldType: fieldType, operator: Operator.EqualTo, value: '' }
  ]
});

export function createDefultColumnDef(fieldName: string, extras: any = {}, fieldType = FieldType.Text): ColumnDef {
  return { filterActive: false, filter: getDefualtFilter(fieldName, fieldType), fieldName: fieldName, extras: extras };
}

export function clearFilters(def: ColumnDef) {
  return { ...def, filterActive: false, filter: getDefualtFilter(def.fieldName, def.filter.filters[0].fieldType), sort: undefined };
}

function conditionToserializable(cond: Condition): Condition {
  if (cond.value instanceof Date) {
    return { ...cond, value: cond.value.toISOString() };
  } else if (cond.value && cond.fieldType === FieldType.Number && !isNaN(parseInt(cond.value.toString(), 0))) {
    return { ...cond, value: parseInt(cond.value.toString(), 0) };
  }
  return cond;
}

function normalizeFilter(_filter: Filter<Filter<Condition>>) {
  // const checkLogic = (obj: Filter<any>) => {
  //   if (!obj.filters) {
  //     return obj;
  //   }
  //   if (obj.filters.length === 1) {
  //     obj = { filters: obj.filters};
  //   }
  //   obj.filters = obj.filters.map((obj2) => checkLogic(obj2));
  //   return obj;
  // };

  // if (_filter.filters.length === 1) {
  //   return _filter.filters[0];
  // }
  // const temp: any = [];
  // _filter.filters.forEach((val, i) => {
  //   if (val.filters && val.filters.length > 0 ) {
  //     val.filters.map(item => {
  //       temp.push(item);
  //     });
  //   }
  // });
  // return { logic: Logic.And, filters: temp };
  return _filter;
}

export function toODataFilter(defs: ColumnDef[]): Filter<Filter<Condition>> {
  if (!!defs) {
    const activeFilter = defs.filter((def) => def.filterActive);
    if (activeFilter.length > 0) {
      // return normalizeFilter(activeFilter.reduce((filter, def) => {
      return normalizeFilter(activeFilter.reduce((_filter, def) => {
        _filter.filters.push({
          ...def.filter, filters: def.filter.filters
            .map(conditionToserializable)
            .filter(__filter => __filter.value !== '')
        });
        return _filter;
      }, { logic: Logic.And, filters: [] }));
    }
  }
  return null;
}


export function getPaginatorSkip(def: PaginatorDef) {
  return def.itemPerPage * def.currentPage;
}

export function toODataSort(defs: ColumnDef[]) {
  const def = defs.find((_def) => !!_def.sort);
  if (def) {
    return [{ dir: def.sort.dir, field: def.sort.field }];
  }
  return null;
}

export function applyFieldSort(current: ColumnDef[], changedDef: ColumnDef) {
  return current.map((def) => {
    if (def.fieldName === changedDef.fieldName) {
      if (changedDef.sort && changedDef.sort.dir === SortDirections.Desc) {
        return { ...def, sort: null };
      }
      const dir = !!changedDef.sort && changedDef.sort.dir === SortDirections.Asc ? SortDirections.Desc : SortDirections.Asc;
      return { ...def, sort: { dir: dir, field: changedDef.fieldName } };
    } else {
      return { ...def, sort: null };
    }
  });
}

export function applyColumnFilter(current: ColumnDef[], changedDef: ColumnDef) {
  const cloneCond = (filters: Condition[]) => filters.map((cond) => ({ ...cond }));
  return current.map((def) => {
    if (def.fieldName === changedDef.fieldName && changedDef.filter.filters[0].value.toString().trim()) {
      return {
        ...def, filterActive: true, filter: {
          ...def.filter,
          logic: changedDef.filter.logic,
          filters: cloneCond(changedDef.filter.filters)
        }
      };
    }
    return def;
  });
}

export function clearColumnFilter(current: ColumnDef[], changedDef: ColumnDef) {
  return current.map((def) => {
    if (def.fieldName === changedDef.fieldName) {
      return clearFilters(def);
    }
    return def;
  });
}


export function createColumnDefHash(defs: ColumnDef[]) {
  const createConditionHash = (condition: Condition) => [condition.field, condition.operator, condition.value].join('|');
  return defs.map((def) => [def.fieldName, def.filterActive].concat(def.filter.filters.map(createConditionHash)).join('|')).join('|');
}



export function applyGroupFilter(gridColumns: ColumnDef[], filterValues: string[], fieldNames: string[]): ColumnDef[] {
  return gridColumns.map(val => {

    for (let i = 0; i < fieldNames.length; i++) {

      if (val.fieldName === fieldNames[i]) {
        const condition = resolveGroupFilterValues(filterValues[i]);
        return {
          ...val,
          filterActive: true,
          filter: {
            ...val.filter,
            filters: [{
              field: fieldNames[i],
              operator: condition[0].operator,
              value: condition[0].value,
              fieldType: FieldType.Text
            }, {
              field: fieldNames[i],
              operator: condition[1] ? condition[1].operator : Operator.EqualTo,
              value: condition[1] ? condition[1].value : '',
              fieldType: FieldType.Text
            }]
          }
        };
      }
      return val;

    }
  });
}

export function paginatorChange(pagerDef: PaginatorDef): PaginatorDef {
  return {
    ...pagerDef,
    currentPage: pagerDef.currentPage,
    itemPerPage: pagerDef.itemPerPage
  };
}

export interface GroupFilter {
  filterValue: string;
  fieldName: string;
  fieldType: FieldType;
}



export function getGridGroupFilters(groupFilters: GroupFilter[]) {

  const filters = [];
  groupFilters.forEach((groupFilter) => {
    const condition = resolveGroupFilterValues(groupFilter.filterValue);


    filters.push({
      field: groupFilter.fieldName,
      operator: condition[0].operator,
      value: getGroupValue(condition[0].value),
      fieldType: groupFilter.fieldType
    });

    if (condition.length === 2) {
      filters.push({
        field: groupFilter.fieldName,
        operator: condition[1] ? condition[1].operator : Operator.EqualTo,
        value: getGroupValue(condition[1].value),
        fieldType: groupFilter.fieldType
      });
    }
  });

  function getGroupValue(conditionValue) {
    return (conditionValue === 'null') ? null : conditionValue;
  }

  const newFilter = {
    logic: 'and',
    filters: [
      {
        logic: 'and',
        filters: filters,
      }]
  };

  return newFilter;
}


function resolveGroupFilterValues(values: string): GroupfilterValue[] {
  const model: GroupfilterValue[] = [];
  values.split('$').map(c => {
    const operator = c.split('£')[0];
    const value = c.split('£')[1];
    model.push({ operator: operator, value: value });
  });
  return model;
}


export function removeFiltertionOptin(columnDef: ColumnDef[]) {
  return columnDef.map(c => {
    return {
      ...c, extras: {
        ...c.extras,
        filterHidden: true,
        disableShort: true
      }
    };
  }
  );
}


