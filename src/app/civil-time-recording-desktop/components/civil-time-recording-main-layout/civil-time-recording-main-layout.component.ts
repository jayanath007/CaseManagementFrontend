import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { CivilClassObj } from '../../../civil-class-management';
import { PaginatorDef } from '../../../core/lib/grid-model';
import { FeeEarnerInfo } from '../../../shared-data';
import { TimeRecordModel, ViewData } from '../../model/interfaces';

@Component({
  selector: 'dps-civil-time-recording-main-layout',
  templateUrl: './civil-time-recording-main-layout.component.html',
  styleUrls: ['./civil-time-recording-main-layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CivilTimeRecordingMainLayoutComponent implements OnInit {

  @Input() isLoading: boolean;
  @Input() feeEarnerList: FeeEarnerInfo[];
  @Input() viewData: ViewData;
  @Input() modelData: TimeRecordModel;
  @Input() classData: CivilClassObj;
  @Input() homeCurrency: string;
  @Output() closePopup = new EventEmitter<any>();
  @Output() selectItemForEdit = new EventEmitter<number>();
  @Output() changeTimeRecordModel = new EventEmitter<{ key: string, value: any }>();
  @Output() userAction = new EventEmitter<string>();
  @Output() changePage = new EventEmitter<PaginatorDef>();
  selectedTabIndex = 0;

  constructor() { }

  ngOnInit() {
  }

  onClose() {
    this.closePopup.emit();
  }

  onSelectItemForEdit(diaryId: number) {
    this.selectItemForEdit.emit(diaryId);
  }

  onChangeTimeRecordModel(event: { key: string, value: any }) {
    this.changeTimeRecordModel.emit(event);
  }

  onUserAction(action: string) {
    this.userAction.emit(action);
  }

  onChangeTap(index: number) {
    this.selectedTabIndex = index;
  }

  onPageChange(event: PaginatorDef) {
    this.changePage.emit(event);
  }


}
