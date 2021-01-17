import { Component, Output, EventEmitter, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog, MatTabChangeEvent, MatBottomSheet, MatBottomSheetRef } from '@angular/material';
import { InforDialogData, InforDialogComponent, TextInsertDialogInput, TextInsertDialogComponent } from '../../../shared';
import { PaginatorDef } from '../../../core/lib/grid-model';
import { ColumnDef } from './../../../core/lib/grid-model';
import { ClientPopupType } from './../../../client-search-core/models/enums';
import { SystemJsPopupLoaderService } from '../../../shell-desktop/services/system-js-popup-loader.service';
import {
  DropdownList, FeeEarnerList, Introducer, StatusList,
  OpportunitySaveViewModel, OpportunityLoadingType, GridDataResponceViewModel, OpertunityState, ScreenItem, OpportunityGridDataViewModel
} from './../../../opportunity-core/models/interfaces';
import { User } from '../../../auth';
import { OppertunitySettingsComponent } from '../oppertunity-settings/oppertunity-settings.component';
import { MasterDataViewModel, DepartmentWithMatterAndAppCode } from '../../../shared-data/model/interface';
import { ShareDataService } from '../../../shared-data/services/share-data.service';
import { LookupList } from '../../../core';

@Component({
  selector: 'dps-opportunity-layout',
  templateUrl: './opportunity-layout.component.html',
  styleUrls: ['./opportunity-layout.component.scss']
})
export class OpportunityLayoutComponent implements OnInit, OnChanges {

  constructor(public popupService: SystemJsPopupLoaderService, private dialog: MatDialog, private bottomSheet: MatBottomSheet) { }

  @Input() columnDef: any;
  @Input() loadSaveOpportunityData: GridDataResponceViewModel;
  @Input() isLoading: OpportunityLoadingType;
  @Input() departmentList: MasterDataViewModel<DepartmentWithMatterAndAppCode[]>;
  @Input() feeEarnerList: FeeEarnerList[];
  @Input() introducerList: Introducer[];
  @Input() statusList: StatusList[];
  @Input() clientDataModel: OpportunitySaveViewModel;
  @Input() selectedTabIndex: number;
  @Input() paginetorDef: PaginatorDef;
  @Input() user: User;
  @Input() stats: OpertunityState;
  @Input() screenList: ScreenItem[];
  @Input() emailTemplete: File;
  @Input() previousEmailTemplete: string;
  @Input() settingIsLoading: boolean;
  @Input() defuiltNote?: string;
  @Input() salTitle: LookupList[];

  @Output() openOpprtunity = new EventEmitter<any>();
  @Output() departmetChangeItem = new EventEmitter<number>();
  @Output() feeEarnerChangeItem = new EventEmitter<any>();
  @Output() introducerChangeItem = new EventEmitter<any>();
  @Output() workTypeChangeItem = new EventEmitter<any>();
  @Output() statusChangeItem = new EventEmitter<any>();
  @Output() refreshData = new EventEmitter<any>();
  @Output() inputChangeData = new EventEmitter<any>();
  @Output() updateSelectedClientData = new EventEmitter<any>();
  @Output() clearOpportunityData = new EventEmitter<any>();
  @Output() sendAndSaveData = new EventEmitter<any>();
  @Output() sendAndQuote = new EventEmitter<any>();
  @Output() changeSelectedTab = new EventEmitter<number>();
  @Output() closeOpportunityPopup = new EventEmitter<any>();
  @Output() changePage = new EventEmitter<PaginatorDef>();
  @Output() columsSortApply = new EventEmitter<ColumnDef>();
  @Output() selectedRowItem = new EventEmitter<any>();
  @Output() changeScreenItem = new EventEmitter<number>();
  @Output() saveScreenList = new EventEmitter();
  @Output() uploadEmailTemplete = new EventEmitter<File>();
  @Output() openSettingPanel = new EventEmitter();
  @Output() sendNotification = new EventEmitter<{ email: string, feeEarnerCode: string, message: string, enquiryId: number }>();
  @Output() changeColumFilteration = new EventEmitter<{ kind: string, columnDef: ColumnDef }>();

  buttonActiveClass: string;
  fontSize: number;
  fontSizeClassTag = 'font-increment-';
  fontSizeClass: string;
  settingPanel: MatBottomSheetRef<OppertunitySettingsComponent, any>;
  openSetting = false;

  get selectedStatus() {
    if (this.statusList) {
      return this.statusList.find((status) => status.isSelected);
    }
    return this.statusList;
  }

  ngOnInit() {
    this.fontSize = 0;
    this.fontSizeClassTag = 'font-increment-';
    this.buttonActiveClass = '';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.settingIsLoading) {
      this.setSettingPanelinput();
    }
  }

  onOpenOpprtunity(item) {
    this.openOpprtunity.emit({ item, dateTimeOffset: this.user.general.dateTimeOffset });
  }
  onChangeFeeEarner(item) {
    this.feeEarnerChangeItem.emit(item);
  }
  onChangeIntroducer(item) {
    this.introducerChangeItem.emit(item);
  }
  onChangeDepartmen(id) {
    this.departmetChangeItem.emit(id);
  }
  onChangeWorkType(item) {
    this.workTypeChangeItem.emit(item);
  }
  onChangeStatus(item) {
    this.statusChangeItem.emit(item.value ? item.value : null);
  }
  onRefreshClick() {
    this.refreshData.emit();
  }
  onInputChangeData(event) {
    this.inputChangeData.emit(event);
  }
  onClientSearch(event: { lName: string, fName: string, company: string }) {
    let clientSearchData;
    // if (!event.lName) {
    //   clientSearchData = {
    //     clientRef: null, searchText: null,
    //     branchId: null, clientName: null
    //   };
    // }
    clientSearchData = {
      clientRef: '', searchText: event.lName,
      branchId: null, clientName: event.lName,
      popupType: ClientPopupType.OpportunityClientSearch,
      popupPara: {
        firstName: this.clientDataModel ? this.clientDataModel.firstName : '',
        lastName: this.clientDataModel ? this.clientDataModel.lastName : '',
        companyName: this.clientDataModel ? this.clientDataModel.companyName : '',
        address: this.clientDataModel ? this.clientDataModel.address1 : '',
        email1: this.clientDataModel ? this.clientDataModel.email1 : '',
        isOpportunityEdit: false
      }
    };
    if (clientSearchData.popupPara.firstName || clientSearchData.popupPara.lastName || clientSearchData.popupPara.companyName) {
      this.popupService.openClientSearchPopup('clientCreationOpportunity', clientSearchData).subscribe((result: any) => {
        if (result) {
          this.updateSelectedClientData.emit(result);
        }
      });
    } else {
      this.showMessage('Search Client', 'You must enter client First Name or Last Name or Company Name');
    }
  }
  showMessage(msgHeading, msgText) {
    const dialogData: InforDialogData = {
      content: {
        title: msgHeading,
        message: msgText
      },
      data: { messageType: 'alert' }
    };
    const dialogRef = this.dialog.open(InforDialogComponent, {
      data: dialogData,
      width: '400px',
      disableClose: true,
      hasBackdrop: true,
      panelClass: 'dps-notification'
    });
  }
  onChangeTab(tab: MatTabChangeEvent) {
    this.changeSelectedTab.emit(tab.index);
  }
  onClearInputData() {
    this.clearOpportunityData.emit();
  }
  onSaveAndSend() {
    this.sendAndSaveData.emit();
  }
  // onPropertyQuote() {
  //   this.propertyQuote.emit();
  // }
  onSaveAndQuote() {
    this.sendAndQuote.emit();
  }
  onChangePage(paginatorDef: PaginatorDef) {
    this.changePage.emit(paginatorDef);
  }
  onToggleSorting(data: ColumnDef) {
    this.columsSortApply.emit(data);
  }
  onRowSelect(row) {
    this.selectedRowItem.emit(row);
  }
  onFontSizeMinusClick() {
    if (this.fontSize > -3) {
      this.buttonActiveClass = 'active';
      this.fontSize -= 1;
      this.fontSizeClass = this.fontSizeClassTag + this.fontSize;
    }
  }
  onFontSizeResetClick() {
    this.buttonActiveClass = '';
    this.fontSize = 0;
    this.fontSizeClass = this.fontSizeClassTag + this.fontSize;
  }
  onFontSizePlusClick() {
    if (this.fontSize < 4) {
      this.buttonActiveClass = 'active';
      this.fontSize += 1;
      this.fontSizeClass = this.fontSizeClassTag + this.fontSize;
    }
  }
  onChangeScreenItem(screenNumber: number) {
    this.changeScreenItem.emit(screenNumber);
  }
  onSaveScreenList() {
    this.saveScreenList.emit();
  }
  openBottomSheet(): void {
    this.openSettingPanel.emit();
    this.openSetting = true;
    if (!!this.previousEmailTemplete) {
      this.setSettingPanelinput();
    }
  }
  setSettingPanelinput() {
    if (this.openSetting && !this.settingIsLoading) {
      this.settingPanel = this.bottomSheet.open(OppertunitySettingsComponent);
      this.settingPanel.instance.file = this.emailTemplete;
      this.settingPanel.instance.previousEmailTemplete = this.previousEmailTemplete;
      this.settingPanel.instance.loading = this.settingIsLoading;
      this.settingPanel.instance.uploadEmailTemplete.subscribe(file => {
        if (!!file) {
          this.uploadEmailTemplete.emit(file);
        }
        this.settingPanel.dismiss();
        this.openSetting = false;
      });
    }
  }
  onClickNotificationSetting(row: OpportunityGridDataViewModel) {

    const dialogData: TextInsertDialogInput = {
      content: {
        title: `Notification (${row.opportunityNumber})`,
        details: '',
        message: '',
        placeholder: '',
        acceptLabel: 'Send'
      },
      allowEmpty: true,
      text: '',
      showCancelBtn: false,
      textArea: { text: 'Messages', value: '' },
      hideTextBox: true
    };
    const dialogRef = this.dialog.open(TextInsertDialogComponent, {
      data: dialogData,
      width: '350px',
      disableClose: true,
      panelClass: 'dps-notification'
    });
    dialogRef.afterClosed().subscribe((dialogResult: TextInsertDialogInput) =>
      this.sendNotification.emit({
        email: row.email1,
        feeEarnerCode: row.feeEarner,
        message: dialogResult.textArea.value,
        enquiryId: row.enquiryId
      }));
  }

  onChangeColumFilteration(event) {
    this.changeColumFilteration.emit(event);
  }

}

