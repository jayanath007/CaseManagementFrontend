import { MatDialog } from '@angular/material';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {
  ProceedingClassInfoViewModal,
  TotalData, LeadUfnTotalSummary
} from '../../../crime-class-information-proceedings-core/models/interfaces';
import { DropDownItem, ControlerProperty, Validation, SummeryViewType } from '../../../core/lib/crime-managment';
import { ModelProperty, CommittedToCrownCourtType } from '../../../crime-class-information-proceedings-core/models/enum';
import { convertUFNString } from '../../../core/lib/matter';
import { showInforDialog, InfoDialogType, showConfirmDialog } from '../../../core/utility/DpsUtility';
import { ConfirmDialogResultKind } from '../../../shared';
import { CrimeClassTotalsSummaryViewModel } from './../../../core/lib/crime-managment';
@Component({
  selector: 'dps-crime-class-info-popup-layout',
  templateUrl: './crime-class-info-popup-layout.component.html',
  styleUrls: ['./crime-class-info-popup-layout.component.scss']
})
export class CrimeClassInfoPopupLayoutComponent implements OnInit {

  constructor(private matDialog: MatDialog) { }

  @Input() isLoading: boolean;
  @Input() infomationModel: ProceedingClassInfoViewModal;
  @Input() stageReachedList: DropDownItem[];
  @Input() matterTypeList: DropDownItem[];
  @Input() outComeCode: DropDownItem[];
  @Input() caseTypes: DropDownItem[];
  @Input() controlProperty: ControlerProperty;
  @Input() ufnValue: string;
  @Input() homeCurrency: string;
  @Input() summeryData: CrimeClassTotalsSummaryViewModel;
  @Input() leadUfnTotalSummary: LeadUfnTotalSummary;
  @Output() closePopup = new EventEmitter();
  @Output() changeModel = new EventEmitter<{ key: ModelProperty, value: any }>();
  @Output() save = new EventEmitter();
  @Output() openLocationSearch = new EventEmitter<string>();
  @Output() closeReopenClass = new EventEmitter<string>();

  modelProperty = ModelProperty;
  committedToCrownCourtType = CommittedToCrownCourtType;
  selectSummeryType: SummeryViewType;
  ispinSummery = false;

  ngOnInit() {
  }
  onClose() {
    this.closePopup.emit();
  }
  onChangeUserInput(key: ModelProperty, value: any) {
    this.changeModel.emit({ key: key, value: value });
  }
  onSave() {
    if (!!this.validateData()) {
      this.save.emit();
    }
  }
  onCloseReopenClass() {
    this.closeReopenClass.emit(this.infomationModel[ModelProperty.closedDate]);
  }
  onOpenLocationSearch(searchText) {
    this.openLocationSearch.emit(searchText);
  }
  get enhanceRateOption() {
    if (this.infomationModel[ModelProperty.isEnhancedRates] && this.infomationModel[ModelProperty.seriousFraudCase]) {
      return [0, 100, 200];
    }
    return [0, 100];
  }

  validateData(): boolean {
    let conformationDialog = null;
    if (!this.ufnValue) {
      showInforDialog('Crime Module', Validation.ufnDateValidation, InfoDialogType.warning, this.matDialog);
      return false;
    }
    if (!!this.infomationModel.openedDate && !!this.ufnValue) {
      const ufnData = new Date(convertUFNString(this.ufnValue)).dateWithOutTime();
      if (new Date(this.infomationModel.openedDate).dateWithOutTime() < ufnData) {
        showInforDialog('Crime Module', Validation.ufnDateCloseDate, InfoDialogType.warning, this.matDialog);
        return false;
      }
    }
    if (!!this.infomationModel.closedDate && !this.infomationModel.billedDate) {
      showInforDialog('Crime Module', Validation.billDate, InfoDialogType.warning, this.matDialog);
      return false;
    }
    if (!!this.infomationModel.closedDate && !!this.infomationModel.billedDate) {
      if (new Date(this.infomationModel.openedDate).dateWithOutTime() > new Date(this.infomationModel.billedDate).dateWithOutTime()) {
        showInforDialog('Crime Module', Validation.billDateOpenDate, InfoDialogType.warning, this.matDialog);
        return false;
      }
    }
    if (!!this.infomationModel.closedDate && !!this.infomationModel.billedDate) {
      if (new Date(this.infomationModel.closedDate).dateWithOutTime() > new Date(this.infomationModel.billedDate).dateWithOutTime()) {
        showInforDialog('Crime Module', Validation.billDateCloseDate, InfoDialogType.warning, this.matDialog);
        return false;
      }
    }
    if (!!this.infomationModel.openedDate && !!this.infomationModel.closedDate) {
      if (new Date(this.infomationModel.openedDate).dateWithOutTime() > new Date(this.infomationModel.closedDate).dateWithOutTime()) {
        conformationDialog = showConfirmDialog('Crime Module', Validation.openDateCloseDate, this.matDialog);
      }
    }
    if (!!conformationDialog) {
      conformationDialog.afterClosed().subscribe(dialogResult => {
        if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
          this.changeModel.emit({ key: ModelProperty.closedDate, value: this.infomationModel.openedDate });
          this.save.emit();
        } else {
          this.changeModel.emit({ key: ModelProperty.closedDate, value: new Date().dateWithOutTime() });
        }
      });
      return false;
    } else {
      return true;
    }
  }

  onViewTotalSummery(type: SummeryViewType) {
    if (!this.isLoading) {
      this.selectSummeryType = type;
    }
  }
  onHideTotal() {
    if (!this.isLoading) {
      this.ispinSummery = false;
      this.selectSummeryType = null;
    }
  }

  get totalViewData(): TotalData {
    if (!!this.infomationModel) {
      return {
        classTotal: this.infomationModel.classTotal,
        leadUfnTotal: this.infomationModel.leadUfnTotal,
        standardFeeTotal: this.infomationModel.standardFeeTotal,
        claimTotal: this.infomationModel.claimTotal,
        classTotalSummary: this.summeryData
      }
    }
    return null;
  }

}
