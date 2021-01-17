import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MatterInputData } from '../../../core';
import { UrgentValue } from '../../../dictations-core/models/enum';
import { DropdownListData, GridRowData, ProfileGroupList, ProfilingRequestModel, TeamTalkAttachMatter } from '../../../dictations-core/models/interface';
import { InforDialogComponent, InforDialogData } from '../../../shared';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';
import { DictationProfilingPopupManagerComponent } from '../../containers/dictation-profiling-popup-manager.component';

@Component({
  selector: 'dps-dictation-profiling-popup',
  templateUrl: './dictation-profiling-popup.component.html',
  styleUrls: ['./dictation-profiling-popup.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DictationProfilingPopupComponent implements OnInit, OnChanges {
  @Input() myToken: string;
  @Input() jobInfo: GridRowData;
  @Input() groupList: any;
  @Input() profileSecrarary: any;
  @Input() profileGroups: ProfileGroupList[];
  @Input() profileLoading: boolean;
  @Input() profileClose: boolean;
  @Input() jobDescriptionList: DropdownListData[];



  @Output() profilingSubmit = new EventEmitter();
  @Output() close = new EventEmitter();
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<DictationProfilingPopupManagerComponent>,
    private popupService: SystemJsPopupLoaderService) { }

  urgentValue = UrgentValue;


  matterDetails: TeamTalkAttachMatter;
  jobName: string;  // matterRef
  jobDescription: string;   // comment
  dueDate: string;
  secFor: number;
  groupFor: number;
  password: string;
  urgency: number;
  privateJob: boolean;
  getDescription() {
    if (this.jobDescriptionList && this.jobDescriptionList.length > 0) {

      return this.jobDescriptionList.map(a => a.value);
    }

  }
  ngOnInit() {
    if (this.jobInfo) {
      this.jobName = this.jobInfo.matterRef; // matterRef
      this.jobDescription = this.jobInfo.comment; // comment
      this.dueDate = this.jobInfo.dueDate;
      this.secFor = this.jobInfo.secFor;
      this.groupFor = this.jobInfo.groupFor;
      this.urgency = this.jobInfo.urgency;
    }
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes.profileClose && !changes.profileClose.isFirstChange() && changes.profileClose.currentValue) {

      if (this.profileClose) {
        this.close.emit();
      }
    }



  }

  onClose() {

    this.close.emit();
  }

  onChangeUrgency(value) {
    this.urgency = value;

  }

  onChangeJobName(value) {
    this.jobName = value;

  }

  onChangeDueDate(value) {
    this.dueDate = value;
  }


  onChangeDescription(value) {
    this.jobDescription = value;

  }

  onSubmitData() {

    const profilingData: ProfilingRequestModel = {

      jobName: this.jobName, // matterRef
      jobDescription: this.jobDescription, // comment
      dueDate: this.dueDate,
      secFor: this.secFor,
      groupFor: this.groupFor,
      secretary: null,
      password: this.password,
      privateJob: this.privateJob,
      matterDetails: this.matterDetails,
      urgency: this.urgency,
      jobInfo: this.jobInfo ? this.jobInfo : null


    };

    if (this.secFor === 0 && this.groupFor === 0) {
      const dialogData: InforDialogData = {
        content: {
          title: 'Message',
          message: 'You must select a typist or a group for this job!',
        },
        data: { messageType: 'alert' }
      };
      const dialogRef = this.dialog.open(InforDialogComponent, {
        data: dialogData,
        width: '300px',
        disableClose: true,
        panelClass: 'dps-notification'
      });

    } else {
      this.profilingSubmit.emit(profilingData);
    }


  }

  onIsPrivateJob(value) {
    this.privateJob = value;
    this.groupFor = 0;

  }

  onChangeGroup(value) {

    this.groupFor = value;

  }
  onChangePassword(value) {
    this.password = value;

  }

  onChangeSecratary(value) {

    this.secFor = value;

  }
  openMatterSearchPopup() {
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
      this.matterDetails = AttachedMatterData;

      // this.attachedMatterForJob.emit({ attachementData: AttachedMatterData ? AttachedMatterData : null, gridRowData: gridRowData });
    });
  }

}


// id: number;
// createdDate ?: string;
// matterRef: string;   // job name
// sentBy: number;  // submitted
// length: number;
// sentTime: string;
// dueDate: string;
// sentByName: string;
// secFor: number;
// secForName: string;
// lockedByName: string; // lockedBy
// completedByName: string;
// level: number;
// userCat: number;
// email: string;
// statusDescription: string;
// comment: string; // jobDescription
// urgency: number;
// // duration: string;
// dictFileName: string;
// origDictFileName: string;
// origFileName: string;
// fileName: string;
// isDPSDoc: boolean;
// dpsFileID: number;
// dpsBranchId: number;
// dpsAppPrefix: string;
// urgentValue: number;
// selected ?: boolean;
// expanded ?: boolean;

// clientName ?: string;
// matterReferenceNo ?: string;
// branchId ?: number;
// appId ?: number;
// appCode ?: string;
// fileId ?: number;
// feeEarner ?: string;
// checkoutDocDetails ?: TeamTalkCheckOutDocResponce;