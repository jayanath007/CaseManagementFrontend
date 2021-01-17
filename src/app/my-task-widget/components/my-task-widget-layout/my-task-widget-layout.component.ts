import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GridData } from '../../../case-task-core/models/interface';
import { BtnOption } from '../../models/enumeration';

@Component({
  selector: 'dps-my-task-widget-layout',
  templateUrl: './my-task-widget-layout.component.html',
  styleUrls: ['./my-task-widget-layout.component.scss']
})
export class MyTaskWidgetLayoutComponent implements OnInit {

  @Input() isLoading: boolean;
  @Input() data: GridData[];
  @Input() layout: number;
  @Output() clickOptionBtn = new EventEmitter<any>();
  @Output() myTaskView = new EventEmitter();
  @Output() removeWidget = new EventEmitter();
  @Output() refreshData = new EventEmitter();

  constructor() { }

  get emptyList() {
    if (this.data && this.data.length < 4) {
      return Array(4 - this.data.length).fill('').map((x, i) => i);
    }
    return [];
  }

  ngOnInit() {
  }

  onClickOptionBtn(value) {
    this.clickOptionBtn.emit(value);
  }

  goToMyTaskView() {
    this.myTaskView.emit();
  }

  onRemove() {
    this.removeWidget.emit();
  }

  onRefreshData() {
    this.refreshData.emit();
  }
}
