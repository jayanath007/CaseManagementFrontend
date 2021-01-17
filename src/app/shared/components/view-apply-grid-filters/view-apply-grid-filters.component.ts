import { Component, OnInit, Input } from '@angular/core';
import { ColumnDef } from '../../../core/lib/grid-model';
import { FieldType, Operator } from '../../../odata';

@Component({
  selector: 'dps-view-apply-grid-filters',
  templateUrl: './view-apply-grid-filters.component.html',
  styleUrls: ['./view-apply-grid-filters.component.scss']
})
export class ViewApplyGridFiltersComponent {

  @Input() columnDef: ColumnDef[];
  fieldType = FieldType;

  constructor() { }

  get filterColumnDef(): ColumnDef[] {
    if (!!this.columnDef) {
      return this.columnDef.filter(c => c.filter && c.filter.filters && c.filter.filters[0] && !!c.filter.filters[0].value);
    }
    return [];
  }

  operatorDisplayName(value: Operator): string {
    switch (value) {
      case Operator.EqualTo: return 'Equal To';
      case Operator.NotEqualTo: return 'Not Equal To';
      case Operator.StartWith: return 'Start With';
      case Operator.Contains: return 'Contains';
      case Operator.DoesNotContains: return 'Does Not Contains';
      case Operator.EndWith: return 'End With';
      case Operator.GreaterThanOrEquel: return 'Greater Than Or Equal';
      case Operator.LessThan: return 'Less Than';
      case Operator.GreaterThan: return 'Greater Than';
      case Operator.NotEqual: return 'Not Equal';
      case Operator.LessThanOrEquel: return 'Less Than Or Equal';
      default: return '';
    }
  }

}
