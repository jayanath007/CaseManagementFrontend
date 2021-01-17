import { InforDialogData } from './../../../shared/models/dialog';
import { InforDialogComponent } from './../../../shared/components/infor-dialog/infor-dialog.component';
import { SystemJsPopupLoaderService } from './../../../shell-desktop';
import { MatterInputData } from './../../../core/lib/matter';

import { Group, EnabaleControlers, PostOfficeActionInputData } from './../../../post-office-action-core/models/interfaces';
import { takeUntil, debounceTime, pairwise } from 'rxjs/operators';
import { ButtonAction, WorkflowActions } from './../../../post-office-action-core/models/enum';
import { Component, OnInit, Input, SimpleChanges, OnChanges, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { PostOfficeActionModel } from '../../../post-office-action-core/models/interfaces';
import { MatDialog } from '@angular/material';
import { TeamMember } from '../../../core/lib/team-members';

@Component({
  selector: 'dps-post-office-action-layout',
  templateUrl: './post-office-action-layout.component.html',
  styleUrls: ['./post-office-action-layout.component.scss']
})
export class PostOfficeActionLayoutComponent implements OnInit, OnChanges, OnDestroy {

  @Input() isLoading: boolean;
  @Input() model: PostOfficeActionModel;
  @Input() inputData: PostOfficeActionInputData;
  @Input() enabaleControlers: EnabaleControlers;
  @Input() feeEarnerList: TeamMember[];
  @Input() groupList: Group[];
  @Input() actionList: { value: number, text: string }[];
  @Input() itemTypeList: any[];
  @Input() diaryFoldesList: any[];
  @Input() isClose: boolean;




  @Output() modelChange = new EventEmitter<{ oldModel: PostOfficeActionModel, newModel: PostOfficeActionModel }>();
  @Output() closePopup = new EventEmitter();
  @Output() clickAction = new EventEmitter<ButtonAction>();
  @Output() groupChange = new EventEmitter();
  isMemberNavExpan = false;

  formGroup: FormGroup;
  private unsubscribe: Subject<void> = new Subject();
  UserAction = ButtonAction;
  clientName = 'Client Name';
  constructor(private formBuilder: FormBuilder, public popupService: SystemJsPopupLoaderService, private dialog: MatDialog) {
    this.buildForm();
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.model && changes.model.currentValue) {
      this.formGroup.patchValue(this.model);
      // console.log(this.formGroup.get('action').value());
    }
    if (changes.isClose && !changes.isClose.isFirstChange() && changes.isClose.currentValue) {
      this.onClose();
    }
  }

  private buildForm() {
    this.formGroup = this.formBuilder.group({
      // dateOn: new FormControl({ value: '' }),
      attachAs: new FormControl({ value: '' }),
      action: new FormControl({ value: '' }),
      diaryFoldes: new FormControl({ value: '' }),
      group: new FormControl({ value: '' }),
      sendTo: new FormControl({ value: '' }),
      itemType: new FormControl({ value: '' }),
      massage: new FormControl({ value: '' }),
      appId: new FormControl({ value: -1 }),
      note: new FormControl({ value: '' }),
    });


    this.formGroup.valueChanges.pipe(takeUntil(this.unsubscribe)).pipe(debounceTime(500), pairwise())
      .subscribe((values) => {

        if (values[0] && JSON.stringify(values[0]) !== JSON.stringify(values[1])) {

          this.modelChange.emit({ oldModel: values[0], newModel: values[1] });
        }

      });

  }

  onChangeGroup(event) {
    // this.groupChange.emit(event.id);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onClose() {
    this.closePopup.emit();
  }

  onClickAction(action: ButtonAction) {

    if (action === ButtonAction.Save) {
      if (this.checkPosting()) {
        this.clickAction.emit(action);
      }
    } else {
      this.clickAction.emit(action);
    }

  }


  onMatterSearch(token, input) {
    const matterInputData: MatterInputData = { isMatterSearch: false };
    this.popupService.openMatterSearchPopup('matterSearchPopup', matterInputData)
      .subscribe((result: any) => {
        if (result) {
          // this.clientName = result.ClientName ? result.ClientName : '';

          this.clientName = result.ClientName + ' - '
            + result.AppCode + ':'
            + result.MatterReferenceNo;

          const oldModel = this.formGroup.getRawValue();

          // MatterReferenceNo: result.MatterReferenceNo,
          // BranchID: result.BranchID,
          // AppID: result.AppID,

          const newModel = { ...oldModel, appId: result.AppID };
          this.modelChange.emit({ oldModel: oldModel, newModel: newModel });
        }
      });
  }






  checkPosting(): boolean {
    let message = '';


    // attachAs: new FormControl({ value: '' }),
    // action: new FormControl({ value: '' }),
    // diaryFoldes: new FormControl({ value: '' }),
    // group: new FormControl({ value: '' }),
    // sendTo: new FormControl({ value: '' }),
    // itemType: new FormControl({ value: '' }),
    // massage: new FormControl({ value: '' }),
    // appId: new FormControl({ value: -1 }),



    if (!this.formGroup.value.sendTo) {
      message += 'Send To Is a required field and must be provided' + '<br>';
    }

    if (this.formGroup.value.action === WorkflowActions.AttachToDiary) {

      if (!this.formGroup.value.appId) {
        message += 'The Branch, App and File No. are required for attaching to file' + '<br>';
      }
      if (!this.formGroup.value.diaryFoldes) {
        message += 'A valid folder Category is required for attaching to file' + '<br>';
      }
      if (!this.formGroup.value.attachAs) {
        message += 'You must specify the Diary Type to attach as' + '<br>';
      }
      if (!this.formGroup.value.toMatterRef) {
        message += 'Please select TO Matter Ref' + '<br>';
      }

    }

    if (parseInt(this.formGroup.value.action, 10) < WorkflowActions.Complete) {
      message += 'Action Is missing or invalid' + '<br>';
    }


    if (message) {
      this.openMSGPopup(message, 'alert');
      return false;
    }

    return true;

  }


  openMSGPopup(msg, type) {
    const dialogData: InforDialogData = {
      content: {
        title: 'Post Office Action',
        message: msg
      },
      data: { messageType: type }
    };
    const dialogRef = this.dialog.open(InforDialogComponent, {
      data: dialogData,
      width: '400px',
      disableClose: true,
      hasBackdrop: true,
      panelClass: 'dps-notification'
    });
    dialogRef.afterClosed();
  }





}
