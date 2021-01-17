import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GridData } from '../../../case-task-core/models/interface';
import { BtnOption } from '../../models/enumeration';

@Component({
  selector: 'dps-work-done-widget-layout',
  templateUrl: './work-done-widget-layout.component.html',
  styleUrls: ['./work-done-widget-layout.component.scss']
})
export class WorkDoneWidgetLayoutComponent implements OnInit {

  @Input() isLoading: boolean;
  @Input() data: GridData[];
  @Input() layout: number;
  @Output() clickOptionBtn = new EventEmitter<any>();
  @Output() openWorkDoneView = new EventEmitter();
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

  goToWorkDoneView() {
    this.openWorkDoneView.emit();
  }

  onRemove() {
    this.removeWidget.emit();
  }
  onOpenItem(event) {

  }

  onRefreshData() {
    this.refreshData.emit();
  }
}
