import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AddTimeType } from '../../../core/lib/timeRecord';
import { Module, SettingKey } from '../../../core/lib/app-settings';
import { AccessControlService } from './../../../auth/services/access-control.service';
import { MainMenuItem } from './../../../layout-desktop/models/interfaces';
import { GridRowItemWrapper, MatterInfo } from '../../../core/lib/matter';
import { MenuButtonClickType } from '../../../open-case-core/models/enums';
import { Observable } from 'rxjs';
import { InforDialogComponent, InforDialogData } from '../../../shared';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'dps-open-case-header',
  templateUrl: './open-case-header.component.html',
  styleUrls: ['./open-case-header.component.scss']
})
export class OpenCaseHeaderComponent implements OnInit {
  @Input() hedingText: string;
  @Input() menuButtonType: string;
  @Input() isFromFileBase: boolean;
  @Input() isDirtyMenu: boolean;
  @Input() workFlowButtonStatus: boolean;
  @Input() matterInfo: MatterInfo;
  @Input() selectedFileHistoryTab: string;
  @Input() menuItem: MainMenuItem<any>[];
  @Input() ammendTemplatesMenus: boolean;
  @Input() matterData: GridRowItemWrapper;

  @Output() addNoteOpenClick = new EventEmitter();
  @Output() addTaskOpenClick = new EventEmitter();
  @Output() timeRecordOpenClick = new EventEmitter<string>();
  @Output() mailOpenClick = new EventEmitter<string>();
  @Output() viewWorkflowOut = new EventEmitter<string>();
  @Output() viewProperties = new EventEmitter<string>();
  @Output() ledgerCardOpenClick = new EventEmitter();
  @Output() matterCreationClick = new EventEmitter();
  @Output() openBillingGuide = new EventEmitter();
  @Output() openEchit = new EventEmitter();
  @Output() openCrimeClassManager = new EventEmitter();
  @Output() eBillingTypeData = new EventEmitter();
  @Output() clientCreationClick = new EventEmitter();
  @Output() openConflictSearch = new EventEmitter();
  @Output() openCrimeDuty = new EventEmitter();
  @Output() openProbate = new EventEmitter();
  @Output() openCivilTimeRecording = new EventEmitter();
  @Output() openBundle = new EventEmitter();
  @Output() openLinkedMatter = new EventEmitter();
  @Output() manageDiaryFolders = new EventEmitter();
  @Output() openBillingRequest = new EventEmitter<any>();
  @Output() sendMsgViaMLS = new EventEmitter();
  @Output() formsLibrary = new EventEmitter();

  viewProperty = false;
  module = Module;
  amendScreensWorkflow$ = new Observable<any>();
  isPlotUser$ = new Observable<any>();
  timeType = AddTimeType;

  constructor(private access: AccessControlService, private dialog: MatDialog) { }

  ngOnInit() {
    this.amendScreensWorkflow$ = this.access.getSettingValue(SettingKey.AmendScreensWorkflow);
    this.isPlotUser$ = this.access.getSettingValue(SettingKey.IsPlotUser);
  }
  onClientCreationClick() {
    this.clientCreationClick.emit();
  }
  onMatterCreationClick() {
    this.matterCreationClick.emit();
  }
  onOpenAddNote() {
    this.addNoteOpenClick.emit();
  }
  onOpenAddTask() {
    this.addTaskOpenClick.emit();
  }
  onOpenTimeRecord() {
    if (this.matterData && this.matterData && this.matterData.data.closed) {
      this.showValidationMsg('You cannot record time against selected matter because it is closed. It cannot be added.');
    } else {
      this.timeRecordOpenClick.emit();
    }
  }
  onOptionsClick() {
  }
  onOpenMailPopup() {
    this.mailOpenClick.emit();
  }
  onOpenLedgerCard() {
    this.ledgerCardOpenClick.emit();
  }
  // menu
  fileHistoryClick() {
    this.viewWorkflowOut.emit(MenuButtonClickType.ViewFileHistoy);
  }
  viewWorkflowClick() {
    this.viewWorkflowOut.emit(MenuButtonClickType.WorkflowMenuView);
  }
  editWorkflowClick() {
    this.viewWorkflowOut.emit(MenuButtonClickType.WorkflowMenuEdit);
  }
  workflowMenuEditSaveAll() {

  }
  WorkflowMenuFileBaseClick() {
    this.viewWorkflowOut.emit(MenuButtonClickType.FileBaseMenuSave);
  }
  WorkflowMenuSaveClick() {
    this.viewWorkflowOut.emit(MenuButtonClickType.SaveMenuEdit);
  }
  closeEditingClick() {
    this.viewWorkflowOut.emit(MenuButtonClickType.CloseMenuEdit);
  }
  WorkflowRuleClick() {
    this.viewWorkflowOut.emit(MenuButtonClickType.WorkflowRules);
  }
  PropertiesClick() {
    this.viewProperty = !this.viewProperty;
    this.viewProperties.emit(MenuButtonClickType.ViewProperty);
  }

  openFormsLibraryPopup() {
    this.formsLibrary.emit(MenuButtonClickType.ViewFormsLibrary);
  }
  onOpenBillingGuide() {
    this.openBillingGuide.emit();
  }
  onOpenEchit() {
    this.openEchit.emit();
  }
  onOpenCrimeClassManager() {
    this.openCrimeClassManager.emit();
  }
  onEBilling() {
    this.eBillingTypeData.emit();
  }
  onOpenConflictSearch() {
    this.openConflictSearch.emit();
  }
  onOpenCrimeDuty() {
    this.openCrimeDuty.emit();
  }
  onOpenProbate() {
    this.openProbate.emit();
  }
  onOpenCivilTimeRecording() {
    this.openCivilTimeRecording.emit();
  }
  onOpenBundle() {
    this.openBundle.emit();
  }

  onLinkedMatter() {
    this.openLinkedMatter.emit();
  }

  onSendMsgViaMLS() {
    this.sendMsgViaMLS.emit();
  }

  getToolTip(id: string): string {
    return this.menuItem.find(i => i.id === id).label;
  }
  onManageDiaryFolders() {
    this.manageDiaryFolders.emit();
  }
  openBillingRequestPopup() {
    if (this.matterData && this.matterData && this.matterData.data.closed) {
      this.showValidationMsg('You cannot billing request against selected matter because it is closed. It cannot be added.');
    } else {
      this.openBillingRequest.emit();
    }
  }
  moduleIsActive(module: Module) {
    return this.access.checkModuleIsActive(module);
  }
  get timeRecordType() {
    if (this.matterInfo) {
      return this.access.checkTimeRecordType(this.matterInfo.AppCode, this.matterInfo.eBilling, this.matterInfo.isLegalAid);
    }
  }
  showValidationMsg(msg: string) {
    const dialogData: InforDialogData = {
      content: {
        title: 'Matter is closed',
        message: msg
      },
      data: { messageType: 'alert' }
    };
    const dialogRef = this.dialog.open(InforDialogComponent, {
      data: dialogData,
      width: '400px',
      disableClose: true,
      panelClass: 'dps-notification'
    });
  }
}
