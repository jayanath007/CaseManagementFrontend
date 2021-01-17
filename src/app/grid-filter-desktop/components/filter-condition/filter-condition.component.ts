import { DatePipe } from '@angular/common';
import { Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Condition, Operator, FieldType, DocType } from '../../../odata';
import { MatDatepickerInputEvent } from '@angular/material';

@Component({
  selector: 'dps-filter-condition',
  templateUrl: './filter-condition.component.html',
  styleUrls: ['./filter-condition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterConditionComponent implements OnInit {

  constructor(private datePipe: DatePipe) { }

  private textOperators: { id: Operator, label: string }[] = [
    { id: Operator.EqualTo, label: 'Equal to' },
    { id: Operator.NotEqualTo, label: 'Not equal to' },
    { id: Operator.StartWith, label: 'Starts with' },
    { id: Operator.Contains, label: 'Contains' },
    { id: Operator.DoesNotContains, label: 'Does not contain' },
    { id: Operator.EndWith, label: 'Ends with' }
  ];

  private textEqOrNotOperators: { id: Operator, label: string }[] = [
    { id: Operator.EqualTo, label: 'Equal to' },
    { id: Operator.NotEqual, label: 'Not equal to' },
  ];

  private textAfterBeforOperators: { id: Operator, label: string }[] = [
    { id: Operator.LessThan, label: 'Before' },
    { id: Operator.GreaterThan, label: 'After' },
  ];

  private dateOperators: { id: Operator, label: string }[] = [
    { id: Operator.EqualTo, label: 'Equal' },
    { id: Operator.NotEqualTo, label: 'Not equal to' },
    { id: Operator.GreaterThanOrEquel, label: 'After or equal to' },
    { id: Operator.GreaterThan, label: 'After' },
    { id: Operator.LessThanOrEquel, label: 'Before or equal to' },
    { id: Operator.LessThan, label: 'Before' },
  ];

  private numberOperators: { id: Operator, label: string }[] = [
    { id: Operator.EqualTo, label: 'Is equal to' },
    { id: Operator.NotEqualTo, label: 'Is not equal to' },
    { id: Operator.GreaterThanOrEquel, label: 'Is greater than or equal to' },
    { id: Operator.GreaterThan, label: 'Is greater than' },
    { id: Operator.LessThanOrEquel, label: 'Is less than or equal to' },
    { id: Operator.LessThan, label: 'Is less than' },
    { id: Operator.LessThanOrEquel, label: 'Is less than or equal to' },
  ];

  private operatorMap = new Map([[FieldType.Text, this.textOperators], [FieldType.TextEqulOrNot, this.textEqOrNotOperators],
  [FieldType.TextAfterBefore, this.textAfterBeforOperators],
  [FieldType.Number, this.numberOperators], [FieldType.Date, this.dateOperators],
  [FieldType.DropValue, this.textEqOrNotOperators]]);

  FieldType = FieldType;
  docType = DocType;
  events: string[] = [];
  @Input() condition: Condition;
  @Output() valueChange = new EventEmitter();
  @Output() operatorChange = new EventEmitter();
  @Output() submit = new EventEmitter();

  ngOnInit() {
  }

  onOperatorChange(value) {
    this.operatorChange.emit(value);
  }

  onValueChange(value) {
    if (value.keyCode === 13 && value.target.value) {
      this.submit.emit();
    }
    this.valueChange.emit(value.target.value);
  }

  changeDate(type: string, event: MatDatepickerInputEvent<Date>) {
    const date = this.datePipe.transform(event.value, 'yyyy-MM-ddT00:00:00.0000000');
    this.valueChange.emit(Date.parse(date) ? date : null);
  }
  onDropValueChange(data) {
    this.valueChange.emit(data.value);
  }

  onDateSubmit(event) {
    if (event.keyCode === 13 && event.target.value) {
      this.submit.emit();
    }
    // const date = this.datePipe.transform(event.target.value, 'yyyy-MM-ddT00:00:00.0000000');
  }

  get operatorList() {
    if (!this.condition) {
      return [];
    }
    return this.operatorMap.get(this.condition.fieldType);
  }

  // addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
  //   this.events.push(`${type}: ${event.value}`);
  // }

}
