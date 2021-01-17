import { PaginatorDef } from './../../core/lib/grid-model';
import { MatDialog } from '@angular/material';
import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CivilTimeRecordingModuleInput } from '..';
import { CivilClassObj } from '../../civil-class-management';
import { showConfirmDialog } from '../../core/utility/DpsUtility';
import { getHomeCurrency } from '../../setting-core';
import { FeeEarnerInfo, getFeeEarnerList } from '../../shared-data';
import * as action from '../actions/core';
import { TimeRecordModel, ViewData } from '../model/interfaces';
import * as selector from '../reducers';
import { ConfirmDialogResultKind } from '../../shared';

@Component({
  selector: 'dps-civil-time-recording-manager',
  template: '<ng-content></ng-content>'
})
export class CivilTimeRecordingManagerComponent implements OnInit {

  @Input() token: string;
  @Input() moduleInput: CivilTimeRecordingModuleInput;

  isLoadin$: Observable<boolean>;
  feeEarnerList$: Observable<FeeEarnerInfo[]>;
  viewData$: Observable<ViewData>;
  modelData$: Observable<TimeRecordModel>;
  classData$: Observable<CivilClassObj>;
  homeCurrency$: Observable<string>;
  isDirty$: Observable<boolean>;

  constructor(protected store: Store<any>, private dialog: MatDialog) { }

  ngOnInit() {
    this.store.dispatch(new action.InitCivilTimeRecording(this.token, { inputData: this.moduleInput }));
    this.isLoadin$ = this.store.select(selector.getIsLoading(this.token));
    this.feeEarnerList$ = this.store.select(getFeeEarnerList(true));
    this.viewData$ = this.store.select(selector.getCivilClassViewData(this.token));
    this.modelData$ = this.store.select(selector.getCivilClassModelData(this.token));
    this.classData$ = this.store.select(selector.getCivilClassInfo(this.token));
    this.homeCurrency$ = this.store.select(getHomeCurrency());
  }

  onSelectItemForEdit(diaryId: number) {
    this.store.dispatch(new action.GetCivilTimeRecodeInfo(this.token, diaryId));
  }

  onChangeTimeRecordModel(event: { key: string, value: any }) {
    this.store.dispatch(new action.ChangeModel(this.token, event));
  }

  onUserAction(userAction: string) {
    switch (userAction) {
      case 'NewTimeRecord':
        this.store.dispatch(new action.NewTimeRecord(this.token));
        break;
      case 'DeleteTimeRecord':
        this.onDeleteTimeRecord();
        break;
      case 'SaveTimeRecord':
        this.store.dispatch(new action.SaveTimeRecord(this.token));
        break;
    }
  }

  private onDeleteTimeRecord() {
    showConfirmDialog('Civil Time Recording',
      'This will delete all time records and disbursements associated with the selected diary records.\n\nProceed?', this.dialog)
      .afterClosed().subscribe(dialogResult => {
        if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
          this.store.dispatch(new action.DeleteTimeRecord(this.token));
        }
      });
  }

  onChangePage(event: PaginatorDef) {
    this.store.dispatch(new action.ChangeTimeRecordPage(this.token, event));
  }

}

