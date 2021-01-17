import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { BaseCrimeManagementManager } from '../../crime-management-core/containers/base-crime-management-manager';
import { TimeInformationInputData, CrimeManagementInput, OpenType } from '../../core/lib/crime-managment';
import { SystemJsPopupLoaderService } from '../../shell-desktop';
import { UpdateModelType, UserAction } from '../../crime-management-core/models/enum';
import { ClassObj } from '../../crime-management-core/models/interfaces';
import { FileHistoryRefresh } from '../../file-history-core/actions/core';
import { showConfirmDialog, InfoDialogType, showInforDialog } from '../../core/utility/DpsUtility';
import { ConfirmDialogResult, ConfirmDialogResultKind } from './../../shared/models/dialog';
import { RefreshClassList } from '../../crime-management-core/actions/core';

@Component({
  // exportAs: 'crimeManagementManager',
  selector: 'dps-crime-management-manager',
  template: '<ng-content></ng-content>',
  styles: []
})
export class CrimeManagementManagerComponent extends BaseCrimeManagementManager implements OnInit {

  constructor(store: Store<any>, private popupService: SystemJsPopupLoaderService, private dialog: MatDialog) {
    super(store);
  }

  @Input() inputData: CrimeManagementInput;
  @Input() token: string;
  @Input() isPopup: boolean;

  @Output() closePopup = new EventEmitter();

  ngOnInit() {
    super.initSelectors(this.token, this.isPopup, this.inputData);
  }


  onUpdateAddClassModel(data: { kind: UpdateModelType, value: string | number }) {
    this.updateAddClassModel(this.token, data);
  }

  onUserAction(data: { kind: UserAction, classInfo?: ClassObj }) {
    switch (data.kind) {
      case UserAction.AddClass:
        this.addClass(this.token);
        break;
      case UserAction.ProcessClass:
        this.onProcessClass(data.classInfo);
        break;
      case UserAction.DeleteClass:
        this.onDeleteClass(data.classInfo);
        break;
      case UserAction.OpenClassInfo:
        this.onOpenClassInfo(this.token, data.classInfo);
        break;
      case UserAction.CRM11:
      case UserAction.CRM7:
      case UserAction.CRM18:
        if (!!data.classInfo && !!data.classInfo.dateclsd) {
          this.runScreenOption(this.token, data.classInfo, data.kind);
          this.closePopup.emit();
        } else {
          showInforDialog('Crime Module', 'Please close the class to run this form', InfoDialogType.alert, this.dialog);
        }

        break;
    }
  }

  onDeleteClass(classInfo: ClassObj) {
    showConfirmDialog('Delete Note', 'Are you sure you want to delete the selected class?', this.dialog).afterClosed()
      .subscribe(
        (result: ConfirmDialogResult) => {
          if (result.kind === ConfirmDialogResultKind.Confirmed) {
            this.deleteClass(this.token, classInfo);
          }
        }
      );
  }

  onProcessClass(classInfo: ClassObj) {
    const input: TimeInformationInputData = {
      matterReferenceNo: this.inputData.matterReferenceNo,
      branchId: this.inputData.branchId,
      appId: this.inputData.appId,
      fileId: this.inputData.fileId,
      classId: classInfo.rectype,
      crimeTimeId: null,
      isEdit: false,
      ufnDate: this.inputData.ufnValue,
    };
    this.popupService.openTimeInformationPopup('mainTimeInformationPopup', input)
      .subscribe((value) => {
        const initFileHistoryToken = 'InitFileHistory' + this.inputData.matterReferenceNo;
        if (classInfo.rectype === 3) {  /// need remove after complete backend
          this.store.dispatch(new RefreshClassList(this.token));
        } else {
          this.getClassTotal(this.token, classInfo);
        }
        return this.store.dispatch(new FileHistoryRefresh(initFileHistoryToken));

      });
  }

}
