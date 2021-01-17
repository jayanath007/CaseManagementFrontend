
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ColumnDef } from '../../../core/lib/grid-model';
import { MatterInputData } from '../../../core/lib/matter';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';
import {
  GridDataFilter, GridRowData, LoginUser, GroupInfo, StatusSummaryModel,
  TeamTalkAuthors, TeamTalkAttachMatter, TeamTalkUserSuccessInfo
} from '../../../dictations-core/models/interface';
import { MatDialog } from '@angular/material';
import { InforDialogData } from '../../../shared/models/dialog';
import { InforDialogComponent } from '../../../shared';
import { UserType } from '../../../dictations-core/models/enum';
import { PaginatorDef } from './../../../core/lib/grid-model';

@Component({
  selector: 'dps-dictations-layout',
  templateUrl: './dictations-layout.component.html',
  styleUrls: ['./dictations-layout.component.scss']
})
export class DictationsLayoutComponent implements OnInit, OnChanges {
  @Input() coloumnDef: ColumnDef[];
  @Input() loginUser: any;
  @Input() loading: boolean;
  @Input() myJobList: GroupInfo[]; // to add interface
  @Input() jobStageList: any;   // to add interface
  @Input() usetType: LoginUser;   // to add interface
  @Input() dictationGridFilters: GridDataFilter;
  @Input() matterRef: string; // To add matter ref with raw data wiew model
  @Input() dictationGridData: GridRowData[];
  @Input() stateCounts: StatusSummaryModel[];
  @Input() authorList: TeamTalkAuthors[];
  @Input() userValidationMsg: TeamTalkUserSuccessInfo;
  @Input() paginatorDef: PaginatorDef;

  @Output() playDictations = new EventEmitter();
  @Output() openWordFileDictation = new EventEmitter();
  @Output() competedJobDictations = new EventEmitter();
  @Output() finishJobUpdate = new EventEmitter();
  @Output() openCaseDictation = new EventEmitter();
  @Output() openDictationPdf = new EventEmitter();
  @Output() refreshGrid = new EventEmitter();

  @Output() attachedMatterForJob = new EventEmitter<{ attachementData: TeamTalkAttachMatter, gridRowData: GridRowData }>();
  @Output() authorChange = new EventEmitter();
  @Output() jobStageChange = new EventEmitter();
  @Output() jobsForChange = new EventEmitter();
  @Output() rowExpand = new EventEmitter();
  @Output() changePage = new EventEmitter<PaginatorDef>();
  @Output() uploadSelectedFile = new EventEmitter<any>();
  @Output() openDictatioProfiling = new EventEmitter<any>();
  @Output() openCaseFile = new EventEmitter<any>();

  constructor(private popupService: SystemJsPopupLoaderService, private dialog: MatDialog) { }

  UserType = UserType;

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes.userValidationMsg && !changes.userValidationMsg.isFirstChange() && changes.userValidationMsg.currentValue) {

      //  if (this.userValidationMsg && this.userValidationMsg.message) {
      this.showValidationMsg();
      //  }
    }
  }


  showValidationMsg() {

    const dialogData: InforDialogData = {
      content: {
        title: 'Dictation Info',
        message: 'User is not added in the Dictation module.'
      },
      data: { messageType: 'warning' }
    };
    const dialogRef = this.dialog.open(InforDialogComponent, {
      data: dialogData,
      width: '400px',
      disableClose: true,
      panelClass: 'dps-notification'
    });

  }


  getSummaryCount(stage) {
    if (this.stateCounts) {
      const sunmmary = this.stateCounts.find(i => i.status === stage);
      return sunmmary ? sunmmary.count : 0;

    }

  }

  onPlayDictations(itemRow) {

    this.playDictations.emit(itemRow);

    // const win = window.open('/dictation_audio_player/jobId',
    //   'dps-dictation-audio-player',
    //   `toolbar=no, location=no, directories=no, status=no, menubar=no,
    //    scrollbars=no, resizable=no, copyhistory=no, height=220, width=500,
    //    left=0, top=0
    //   `
    // );

  }


  // onPlayDictations(event){
  //   this.playDictations.emit();
  //     }

  onCompetedJobDictations(event) {


    if (event.itemRow.dpsFileID) {

      // const dialogData: InforDialogData = {
      //   content: {
      //     title: 'Message',
      //     message: 'The Job is Completed successfully.',
      //   },
      //   data: { messageType: 'success' }
      // };
      // const dialogRef = this.dialog.open(InforDialogComponent, {
      //   data: dialogData,
      //   width: '300px',
      //   disableClose: true,
      //   panelClass: 'dps-notification'
      // });
      this.competedJobDictations.emit(event);

    } else {

      const dialogData: InforDialogData = {
        content: {
          title: 'Message',
          message: 'You cannot send to completed without a DPS case file.',
        },
        data: { messageType: 'alert' }
      };
      const dialogRef = this.dialog.open(InforDialogComponent, {
        data: dialogData,
        width: '300px',
        disableClose: true,
        panelClass: 'dps-notification'
      });


    }

  }
  onOpenWordFileDictation(itemRow) {
    this.openWordFileDictation.emit(itemRow);
  }

  onOpenCaseDictation(gridRowData) {
    this.openMatterSearchPopup(gridRowData);

  }

  onFinishJobUpdate(event) {
    this.finishJobUpdate.emit(event);

  }

  onJobStageChange(value) {
    this.jobStageChange.emit(value);
  }

  onJobsForChange(value) {
    this.jobsForChange.emit(value);
  }



  openMatterSearchPopup(gridRowData) {
    const matterInputData: MatterInputData = { isMatterSearch: false };
    this.popupService.openMatterSearchPopup('matterSearchPopup', matterInputData).subscribe((result) => {
      if (!result) {
        return '';
      }

      const AttachedMatterData: TeamTalkAttachMatter = {

        clientName: result.ClientName,
        matterReferenceNo: result.MatterReferenceNo,
        branchId: result.BranchID,
        appId: result.AppID,
        appCode: result.AppCode,
        fileId: result.FileID,
        feeEarner: result.FeeEarner,

      };

      this.attachedMatterForJob.emit({ attachementData: AttachedMatterData ? AttachedMatterData : null, gridRowData: gridRowData });
    });
  }

  GridrowExpand(row) {
    this.rowExpand.emit(row);
  }

  onAuthorChange(value) {
    this.authorChange.emit(value);
  }



  onPdfFileClick(itemRow) {
    this.openDictationPdf.emit(itemRow);
  }

  onRefresh() {
    this.refreshGrid.emit();

  }

  onChangePage(pageDef: PaginatorDef) {
    this.changePage.emit(pageDef);
  }

  onUploadSelectedFile(event) {
    if (event) {
      this.uploadSelectedFile.emit(event);

    }
  }
  onOpenDictatioProfiling(event) {
    this.openDictatioProfiling.emit(event);

  }

  onOpenCaseFile(value) {
    this.openCaseFile.emit(value);
  }
}


