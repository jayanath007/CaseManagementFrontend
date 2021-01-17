import { DatePipe } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ScreenEditComponentTreeData } from '../../../core';
import { MatDatepickerInputEvent } from '@angular/material';

@Component({
  selector: 'dps-edit-screen-datepicker',
  templateUrl: './edit-screen-datepicker.component.html',
  styleUrls: ['./edit-screen-datepicker.component.scss']
})
export class EditScreenDatepickerComponent implements OnInit {

  @Input() meta: ScreenEditComponentTreeData;
  @Input() modelData: any;
  @Input() lableName?: string;
  @Input() hidden: boolean;
  @Input() disabled: boolean;
  @Input() readonly: boolean;

  @Output() dateChange = new EventEmitter();

  constructor(private datePipe: DatePipe) { }

  ngOnInit() {
  }

  onChangeDateTime(event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      const date = this.datePipe.transform(event.value, 'yyyy-MM-dd');
      this.dateChange.emit(date ? (date + 'T00:00:00') : null);
    } else {
      this.dateChange.emit(null);
    }
  }
}
