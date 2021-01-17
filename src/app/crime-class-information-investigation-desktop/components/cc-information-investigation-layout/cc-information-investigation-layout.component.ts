import { CrimeClassTotalsSummaryViewModel, CrimeLookUpFiled, CRIME_LOOKUP_FILEDS } from './../../../core/lib/crime-managment';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { InvestigationClassInfo, TotalViewDisplayModel } from '../../../crime-class-information-investigation-core/models/interfaces';
import { ModelProperty, Controls, Message } from './../../../crime-class-information-investigation-core/models/enum';
import { showInforDialog, InfoDialogType, showConfirmDialog } from '../../../core/utility/DpsUtility';
import { MatDialog } from '@angular/material/dialog';
import { DropDownItem, SummeryViewType, ControlerProperty, Validation } from '../../../core/lib/crime-managment';
import { convertUFNString } from '../../../core/lib/matter';
import { ConfirmDialogResultKind, LookupType, LookupsDialogInput, LoockupItem } from '../../../shared';
import { LookupsComponent } from '../../../shared/components/lookups/lookups.component';
@Component({
  selector: 'dps-cc-information-investigation-layout',
  templateUrl: './cc-information-investigation-layout.component.html',
  styleUrls: ['./cc-information-investigation-layout.component.scss']
})
export class CcInformationInvestigationLayoutComponent implements OnInit {

  constructor(private matDialog: MatDialog) { }

  @Input() isLoading: boolean;
  @Input() controlProperty: ControlerProperty;
  @Input() infomationModel: InvestigationClassInfo;
  @Input() stageReachedList: DropDownItem[];
  @Input() matterTypeList: DropDownItem[];
  @Input() homeCurrency: string;
  @Input() outComeCode: DropDownItem[];
  @Input() summeryData: CrimeClassTotalsSummaryViewModel;
  @Input() total: TotalViewDisplayModel;
  @Input() isRecursive: boolean;
  @Input() ufnValue: string;
  @Input() policeSLookupList: LoockupItem[];
  @Output() close = new EventEmitter();
  @Output() changeModel = new EventEmitter<{ key: ModelProperty, value: any }>();
  // @Output() openPoliceStSearch = new EventEmitter<string>();
  @Output() save = new EventEmitter();
  @Output() closeReopenClass = new EventEmitter<string>();
  @Output() btnAdvoAssiClick = new EventEmitter();

  controler = Controls;
  selectSummeryType: SummeryViewType;
  ispinSummery = false;
  modelProperty = ModelProperty;
  ngOnInit() {
  }

  onBtnAdvoAssiClick() {
    this.btnAdvoAssiClick.emit();
  }
  onClose() {
    this.close.emit();
  }

  onChangeUserInput(event: { key: ModelProperty, value: any }) {
    this.changeModel.emit(event);
  }
  onOpenPoliceStationSearch(searchText: string) {
    // this.openPoliceStSearch.emit(searchText);
    const fileds: CrimeLookUpFiled = CRIME_LOOKUP_FILEDS[LookupType.POLICE_ST_CODES];
    const loockupInput: LookupsDialogInput = {
      title: fileds.title,
      secondTitle: fileds.secondTitle,
      items: this.policeSLookupList,
      keyColumsEnable: false,
      editable: false,
      showCode: true,
      enableSearch: true,
      searchText: searchText
    };
    const dialogRef = this.matDialog.open(LookupsComponent, {
      width: '450px',
      height: '500px',
      data: loockupInput,
      hasBackdrop: true,
      disableClose: true,
      panelClass: 'dps-notification'
    });
    dialogRef.afterClosed().subscribe(
      ((item: LoockupItem) => {
        if (item) {
          this.onChangeUserInput({ key: ModelProperty.policeStId, value: item.code });
        }

      })
    );
  }
  onSave() {
    if (!!this.validateData()) {
      this.save.emit();
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
  onCloseReopenClass() {
    if (!!this.checkPoliceStationValidation(true)) {
      if ((this.infomationModel[ModelProperty.invClassCurrentTotalsViewModel].classCurrentTotalsFixedViewModel.additionalFixFee > 0)
        && !this.infomationModel[ModelProperty.closedDate]) {
        showInforDialog('Crime Module', Message.closeMSG, InfoDialogType.warning, this.matDialog).afterClosed().subscribe(
          () => this.closeReopenClass.emit(this.infomationModel[ModelProperty.closedDate])
        );
      } else {
        this.closeReopenClass.emit(this.infomationModel[ModelProperty.closedDate]);
      }
    }
  }

  validateData(): boolean {
    if (!this.checkPoliceStationValidation()) {
      return false;
    }
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


  checkPoliceStationValidation(tryToClose = false): boolean {
    if (!!this.infomationModel) {
      const stageReached = this.infomationModel[ModelProperty.stageReached];
      if ((stageReached === 'INVC' || stageReached === 'INVD' || stageReached === 'INVJ')) {
        if (!this.infomationModel[ModelProperty.policeStId]) {
          showInforDialog('Crime Module', Validation.policeStationId, InfoDialogType.warning, this.matDialog);
          return false;
        }
        if (tryToClose && this.infomationModel[ModelProperty.subClassMode] === 2) {
          showInforDialog('Crime Module', Validation.needIC2Record, InfoDialogType.warning, this.matDialog);
          return false;
        }
      }
    }
    return true;
  }

}
