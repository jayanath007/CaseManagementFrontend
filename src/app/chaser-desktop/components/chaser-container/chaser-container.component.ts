import { MatDialog } from '@angular/material';

import {
  Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChanges
} from '@angular/core';
import {
  FeeEarner, Folder, TimeType, MatterInfo, ContactMapResponce,
  ContactEmailsViewModel, OneToOneTypeListViewModel
} from '../../../chaser-core/models/interfaces';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';
import { MatterInputData } from '../../../core';
import { UnlinkEmailAddressesComponent } from '../unlink-email-addresses/unlink-email-addresses.component';
import { ConfirmDialogData, ConfirmDialogComponent, ConfirmDialogResultKind, InforDialogData, InforDialogComponent } from '../../../shared';
import { eBillingType } from '../../../core/lib/matter';
import { PrecedentHSModel, WorkType } from '../../../core/lib/precedentHS';
import { AddTimeType, AttType } from '../../../core/lib/timeRecord';
import { Module } from '../../../core/lib/app-settings';
import { AccessControlService } from '../../../auth/services/access-control.service';
import { ClassObj } from './../../../crime-management-core/models/interfaces';
import { filterClassType, filterAttTypeList } from '../../../core/lib/crime-managment';
import { CivilClassObj } from '../../../civil-class-management';
import { CivilDropDownData } from '../../../civil-time-recording-desktop';

@Component({
  selector: 'dps-chaser-container',
  templateUrl: './chaser-container.component.html',
  styleUrls: ['./chaser-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChaserContainerComponent implements OnInit, OnChanges {

  @Input() isLoading: boolean;
  @Input() unitValue: number;
  @Input() feeEarnerList: FeeEarner[];
  @Input() folderList: Folder[];
  @Input() timeTypeList: TimeType[];
  @Input() fileNo: string;
  @Input() fileNoteData: string;
  @Input() openCasefiles: string;
  @Input() openCasefileData: MatterInfo[];
  @Input() typeValueDisable: boolean;
  @Input() selectedMatterInfo: MatterInfo;
  // eBilling Comment
  @Input() pageLoadType: eBillingType;
  @Input() worktypeList: WorkType[];
  @Input() activitiList: PrecedentHSModel[];
  @Input() phaseList: PrecedentHSModel[];
  @Input() phaseWiseTaskList: PrecedentHSModel[];
  @Input() timeRecordType: AddTimeType;
  @Input() classType: ClassObj[];
  @Input() attTypeList: AttType[];
  @Input() section51: boolean;
  @Input() isBulkEntry: boolean;
  @Input() noOfEntryBy: number;
  @Input() uncharged: boolean;

  @Input() homeCurrency: string;
  @Input() precedentUnitValue: number;
  @Input() precedentRate: number;
  @Input() precedentValueTotal: number;
  @Input() civilClassList: CivilClassObj[];
  @Input() civilLevelList: CivilDropDownData[];
  @Input() loadingMatterList: boolean;
  // ----
  @Output() updateSelectedMatterData = new EventEmitter<MatterInfo>();
  @Output() updateSelectedFeeEarner = new EventEmitter<FeeEarner>();
  @Output() updateSelectedFolder = new EventEmitter<Folder>();
  @Output() updateSelectedTimeType = new EventEmitter<TimeType>();

  @Output() updateSelectedFileNote = new EventEmitter<string>();
  @Output() updateSelectedUnit = new EventEmitter<number>();
  @Output() updateSelectedOpenFile = new EventEmitter<MatterInfo>();
  @Output() updateClearData = new EventEmitter<string>();
  @Output() matterLinkOutputData = new EventEmitter();
  // @Output() loadContactRole = new EventEmitter();
  // Lakmal -LS
  @Input() contactMapResponce: ContactMapResponce;

  // eBilling Comment
  @Output() changeWorkType = new EventEmitter<any>();
  @Output() changePhase = new EventEmitter<any>();
  @Output() changeTask = new EventEmitter<any>();
  @Output() changeActivity = new EventEmitter<any>();

  @Output() changeClassType = new EventEmitter<ClassObj>();
  @Output() changeAttType = new EventEmitter<AttType>();
  @Output() changeSection51 = new EventEmitter<boolean>();
  @Output() changeIsBulkEntry = new EventEmitter<boolean>();
  @Output() changeNumOfEntries = new EventEmitter<number>();
  @Output() updateChangeUncharged = new EventEmitter<boolean>();
  @Output() precedentRateValue = new EventEmitter<any>();
  @Output() updatePrecedentUnit = new EventEmitter<any>();
  @Output() loadMatterList = new EventEmitter<any>();
  // Civil
  @Output() changeCivilClass = new EventEmitter<CivilClassObj>();
  @Output() changeCivilLevel = new EventEmitter<CivilDropDownData>();

  selectedMatterRef: string;
  hasMatter = false;
  hasOpenFiles = false;
  matterObject: MatterInfo;
  selectedMatterRefByLoad: string;
  selectedSourceType: string;
  animationClass: string;

  eBillingType = eBillingType;
  timeRecordTypes = AddTimeType;
  module = Module;

  constructor(private popupService: SystemJsPopupLoaderService, private dialog: MatDialog, private access: AccessControlService) { }

  ngOnInit() {
    // this.animationClass = 'matter-link-animate';
    if (this.openCasefileData && this.openCasefileData.length > 0) {
      this.hasOpenFiles = true;
    }
    // const element = document.getElementById('dps_Cheaser_matter_list');
    // const option: ScrollToOptions = { left: 0, top: 10 };
    // element.scrollTo();
    // if (change.selectedMatterInfo && change.selectedMatterInfo.currentValue) {
    //   setTimeout(() => {
    //     this.animationClass = '';
    //   }, 3000);
    // }
  }

  ngOnChanges(change: SimpleChanges) {
    if (change.fileNo && change.fileNo.currentValue) {
      this.hasMatter = true;
    }
    // if (change.selectedMatterInfo && change.selectedMatterInfo.currentValue) {
    //   setTimeout(() => {
    //     this.animationClass = '';
    //   }, 3000);
    // }
  }
  get selectedFeeEarner() {
    if (this.feeEarnerList) {
      return this.feeEarnerList.find((feeEarner) => feeEarner.selected);
    }
    return this.feeEarnerList;
  }
  get selectedFolder() {
    if (this.folderList) {
      return this.folderList.find((folder) => folder.selected);
    }
    return this.folderList;
  }
  get selectedTimeType() {
    if (this.timeTypeList) {
      return this.timeTypeList.find((timeType) => timeType.selected);
    }
    return this.timeTypeList;
  }
  // eBilling Comment
  get selectedWorkType() {
    if (this.worktypeList) {
      return this.worktypeList.find((worktype) => worktype.selected);
    }
    return this.worktypeList;
  }
  get selectedPhase() {
    if (this.phaseList) {
      return this.phaseList.find((phase) => phase.selected);
    }
    return this.phaseList;
  }
  get selectedTask() {
    if (this.phaseWiseTaskList) {
      return this.phaseWiseTaskList.find((task) => task.selected);
    }
    return this.phaseWiseTaskList;
  }
  get selectedActivity() {
    if (this.activitiList) {
      return this.activitiList.find((activiti) => activiti.selected);
    }
    return this.activitiList;
  }
  onMatterSearch() {
    const matterInputData: MatterInputData = { isMatterSearch: false };
    this.popupService.openMatterSearchPopup('matterSearchPopup', matterInputData).subscribe((result: MatterInfo) => {
      if (!result) {
        return '';
      }
      const matterObject: MatterInfo = {
        ClientName: result.ClientName ? result.ClientName : '',
        FeeEarner: result.FeeEarner,
        AppCode: result.AppCode,
        MatterReferenceNo: result.MatterReferenceNo,
        BranchID: result.BranchID,
        AppID: result.AppID,
        FileID: result.FileID,
        eBilling: result.eBilling,
        var1: null,
        var2: null,
        var3: null,
        selected: false,
        isPlotMasterMatter: result.isPlotMasterMatter,
        matterDetails: result.matterDetails,
        RateCategory: result.RateCategory,
        isProspectMatter: result.isProspectMatter,
        isLegalAid: result.isLegalAid
      };
      if (result && result.MatterReferenceNo) {
        this.selectedMatterRef = result.MatterReferenceNo;
      }
      this.updateSelectedMatterData.emit(matterObject);
    });
    // this.updateSelectedMatterData.emit('matterSearch');
  }


  openFileSelct(selectFile: MatterInfo) {
    this.selectedMatterRef = selectFile.MatterReferenceNo;
    this.selectedSourceType = selectFile.source;
    this.updateSelectedOpenFile.emit(selectFile);
  }
  onFileNoteChanged(value) {
    this.updateSelectedFileNote.emit(value);
  }
  onChangeFeeEarner(value: FeeEarner) {
    // this.selectedFeeEarner = value;
    this.updateSelectedFeeEarner.emit(value);
  }
  onFolderChanged(value) {
    this.updateSelectedFolder.emit(value);
  }
  onTimeTypeChange(event) {
    this.updateSelectedTimeType.emit(event);
  }
  openFileExpan(event) {
    setTimeout(() => {
      this.scrollToBottom();
    }, 250);
  }
  onAfterExpand() {
    if (!this.loadingMatterList) {
      this.loadMatterList.emit();
    }
  }
  onUnitFocusOut(value) {
    this.updateSelectedUnit.emit(value);
  }
  removeDecimal(selected) {
    // selected.value = selected.value.replace('.', '');
  }
  onSearchClear() {
    this.selectedMatterRef = '';
    this.selectedSourceType = '';
    this.updateClearData.emit('clear');
    // this.unitValue = 0;
    // this.fileNo = '';
    this.hasMatter = false;
    // this.onFolderChanged({ text: null, value: null, selected: false });
  }

  scrollToBottom(): void {
    const ele = document.getElementsByClassName('chaser-scroll')[0];
    ele.scrollBy(0, ele.scrollHeight);
  }

  onOpenUnlinkEmailAddressesDialog() {
    const displayMSG = `<p>This email address is not connected to this case </p><p> Do you want to connect it?</p>`;
    if (this.contactMapResponce && this.contactMapResponce.haveOneToOneTypes) {
      this.haveOneToOneTypeValidation(displayMSG);
    } else {
      this.withoutOneToOneTypeValidation(displayMSG);
    }
  }
  haveOneToOneTypeValidation(displayMSG) {
    if (this.contactMapResponce && this.contactMapResponce.contactEmailsViewModel &&
      this.contactMapResponce.contactEmailsViewModel.length > 1) {
      const dialogRef = this.dialog.open(UnlinkEmailAddressesComponent, {
        data: this.contactMapResponce,
        width: '600px',
        disableClose: true,
        hasBackdrop: true,
        panelClass: 'dps-notification'
      });
      const link = dialogRef.componentInstance.onLink.subscribe((emailAddress) => {
        this.matterLinkOutputData.emit(emailAddress);
      });
      dialogRef.afterClosed().subscribe(() => {
        link.unsubscribe();
      });
    } else {
      if (this.contactMapResponce && this.contactMapResponce.contactEmailsViewModel &&
        this.contactMapResponce.contactEmailsViewModel.length === 1 &&
        this.contactMapResponce.oneToOneTypeListViewModel) {
        const TypeData = this.contactMapResponce.oneToOneTypeListViewModel.
          filter((item) => item.type === this.contactMapResponce.contactEmailsViewModel[0].type);
        if (TypeData && TypeData.length > 0 && TypeData[0].unableToLinkContact) {
          displayMSG = `<p>More then one contacts in this type. Cannot add.</p>`;
          const dialogInfoData: InforDialogData = {
            content: {
              title: 'Message . . .',
              message: `<p>Cannot be added! Already more than one contact in this type.</p>`
            },
            contentParams: {},
            data: { messageType: 'alert' }
          };
          const dialogInfoRef = this.dialog.open(InforDialogComponent, {
            data: dialogInfoData,
            width: '350px',
            panelClass: 'dps-notification'
          });
        } else if (TypeData && TypeData.length > 0 && TypeData[0].type && TypeData[0].haveContact) {
          displayMSG = ' - ' + this.contactMapResponce.contactEmailsViewModel[0].email + ' - ' +
            `<p> Replace existing contact on this matter?</p>`;
          this.displayConfirmationMSG(displayMSG);
        } else {
          this.displayConfirmationMSG(displayMSG);
        }

      } else {
        this.displayConfirmationMSG(displayMSG);
      }
    }
  }
  displayConfirmationMSG(displayMSG) {
    const dialogData: ConfirmDialogData = {
      content: {
        title: 'Message . . .',
        message: displayMSG,
        acceptLabel: 'Yes',
        rejectLabel: 'No'
      },
      contentParams: {},
      data: null
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
      width: '400px',
      disableClose: true,
      hasBackdrop: true,
      panelClass: 'dps-notification'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.kind === ConfirmDialogResultKind.Confirmed) {
        this.matterLinkOutputData.emit(this.contactMapResponce.contactEmailsViewModel);
      } else {

      }
    });
  }

  withoutOneToOneTypeValidation(displayMSG) {
    if (this.contactMapResponce && this.contactMapResponce.contactEmailsViewModel &&
      this.contactMapResponce.contactEmailsViewModel.length > 1) {
      const dialogRef = this.dialog.open(UnlinkEmailAddressesComponent, {
        data: this.contactMapResponce,
        width: '600px',
        disableClose: true,
        hasBackdrop: true,
        panelClass: 'dps-notification'
      });
      const link = dialogRef.componentInstance.onLink.subscribe((emailAddress) => {
        this.matterLinkOutputData.emit(emailAddress);
      });
      dialogRef.afterClosed().subscribe(() => {
        link.unsubscribe();
      });
    } else {
      const dialogData: ConfirmDialogData = {
        content: {
          title: 'Message . . .',
          message: displayMSG,
          acceptLabel: 'Yes',
          rejectLabel: 'No'
        },
        contentParams: {},
        data: null
      };
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: dialogData,
        width: '400px',
        disableClose: true,
        hasBackdrop: true,
        panelClass: 'dps-notification'
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result && result.kind === ConfirmDialogResultKind.Confirmed) {
          this.matterLinkOutputData.emit(this.contactMapResponce.contactEmailsViewModel);
        } else {

        }
      });
    }
  }
  // eBilling Comment
  onChangeWorkType(event) {
    this.changeWorkType.emit(event.value);
  }
  onChangePhase(event) {
    this.changePhase.emit(event.value);
  }
  onChangeTask(event) {
    this.changeTask.emit(event.value);
  }
  onChangeActivity(event) {
    this.changeActivity.emit(event.value);
  }
  onChangeClassType(cl: ClassObj) {
    this.changeClassType.emit(cl);
  }
  onChangeCrimeWorkType(type: AttType) {
    this.changeAttType.emit(type);
  }
  onChangeSection51(value: boolean) {
    this.changeSection51.emit(value);
  }
  onChangeIsBulkEntry(isBulk: boolean) {
    this.changeIsBulkEntry.emit(isBulk);
  }
  onChangeNumOfEntries(numOfEntri: number) {
    this.changeNumOfEntries.emit(numOfEntri);
  }
  onChangeuncharged(event) {
    this.updateChangeUncharged.emit(event.checked);
  }

  get selectedClassType() {
    if (this.classType) {
      return this.classType.find((cl) => cl.selected);
    }
    return null;
  }
  get selectedAttType() {
    if (this.attTypeList) {
      return this.attTypeList.find((cl) => cl.selected);
    }
    return this.attTypeList;
  }
  onPrecedentChangeRate(rate) {
    this.precedentRateValue.emit(rate.value ? rate.value : 0.00);
  }
  onPrecedentUnitFocusOut(unit) {
    this.updatePrecedentUnit.emit(unit.value ? unit.value : 0.00);
  }
  moduleIsActive(module: Module) {
    return this.access.checkModuleIsActive(module);
  }
  get filterClassType() {
    return filterClassType(this.classType);
  }

  get filterAttTypeList() {
    if (this.selectedClassType) {
      return filterAttTypeList(this.attTypeList, this.selectedClassType.rectype);
    }
    return [];
  }

  // civil 

  get selectedCivilClass() {
    if (this.civilClassList) {
      return this.civilClassList.find((cl) => cl.selected);
    }
    return null;
  }
  get selectedCivilLevel() {
    if (this.civilLevelList) {
      return this.civilLevelList.find((cl) => cl.selected);
    }
    return null;
  }
  onChangeCivilClass(selectClass: CivilClassObj): void {
    this.changeCivilClass.emit(selectClass);
  }

  onChangeCivilLevel(selectLevel: CivilDropDownData): void {
    this.changeCivilLevel.emit(selectLevel);
  }
}
