
import { EventEmitter, Component, OnInit, OnChanges, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { ProbateDealtBy } from '../../../probate-account-core/models/enum';
import { ProbateMatterInput } from '../../../probate-account-core/models/interfaces';
import { DistributionViewItems, EditAccountItemRow } from '../../../probate-core/models/interfaces';


@Component({
  selector: 'dps-probate-account-layout',
  templateUrl: './probate-account-layout.component.html',
  styleUrls: ['./probate-account-layout.component.scss']

})
export class ProbateAccountLayoutComponent implements OnInit, OnChanges {

  @Input() inputData: any;
  @Input() openFrom: any;
  @Input() isPopup: boolean;
  @Input() matterRef: string;
  @Input() title: string;
  @Input() isLoading: boolean;
  @Input() editData: EditAccountItemRow;

  @Input() distributionViewItems: DistributionViewItems[];

  @Input() probateTransId: number;
  @Input() legacyPercentage: number;


  @Input() savedData: any;

  @Input() matterData: ProbateMatterInput;

  @Input() editDataPayment: any;
  @Input() editDataReciept: any;
  @Input() editDataPecuniary: any;
  @Input() editDataResiduary: any;


  @Output() submitSaveData = new EventEmitter<any>();
  @Output() closePopup = new EventEmitter<any>();
  @Output() clear = new EventEmitter<any>();
  hidePanel = true;

  constructor(private store: Store<any>, private dialog: MatDialog, private fb: FormBuilder, private datePipe: DatePipe) {

  }


  ngOnInit() {

  }



  ngOnChanges(changes: SimpleChanges) {
    if (changes.savedData && !changes.savedData.isFirstChange() && changes.savedData.currentValue) {

      if (this.savedData && this.isPopup) {
        this.closePopup.emit(this.savedData);
      } else {
        this.editDataPayment = null;
        this.editDataReciept = null;
        this.editDataPecuniary = null;
        this.editDataResiduary = null;
        this.editData = null;
        this.hidePanel = false;
        setTimeout(() => this.hidePanel = true, 500);
      }
    }

    if (this.editData && this.editData.probateTransId > 0) {
      if (this.editData.dealtBy === ProbateDealtBy.Payment || this.editData.dealtBy === ProbateDealtBy.Sold) {
        this.editDataPayment = this.editData;
        this.editDataReciept = null;
        this.editDataPecuniary = null;
        this.editDataResiduary = null;
      } else if (this.editData.dealtBy === ProbateDealtBy.Receipt) {
        this.editDataPayment = null;
        this.editDataReciept = this.editData;
        this.editDataPecuniary = null;
        this.editDataResiduary = null;

      } else if (this.editData.dealtBy === ProbateDealtBy.DistributionPecuniary) {
        this.editDataPayment = null;
        this.editDataReciept = null;
        this.editDataPecuniary = this.editData;
        this.editDataResiduary = null;

      } else {
        this.editDataPayment = null;
        this.editDataReciept = null;
        this.editDataPecuniary = null;
        this.editDataResiduary = this.editData;

      }







    }





  }


  onClear() {

    this.clear.emit();
  }
  // openMSGPopup(msg, type, isClose) {
  //   const dialogData: InforDialogData = {
  //     content: {
  //       title: 'Plot Synchronization',
  //       message: msg
  //     },
  //     data: { messageType: type }
  //   };
  //   const dialogRef = this.dialog.open(InforDialogComponent, {
  //     data: dialogData,
  //     width: '400px',
  //     disableClose: true,
  //     hasBackdrop: true,
  //     panelClass: 'dps-notification'
  //   });
  //   dialogRef.afterClosed().subscribe(() => {
  //     this.onClose();

  //   });
  // }

  // onSelectedMatter(value) {
  //   this.selectedMatter.emit(value);
  // }



  onClose() {


    this.closePopup.emit(this.savedData);

  }


  onSubmitSaveData(event) {

    this.submitSaveData.emit(event);
  }





  // openLinkedMatter(rowData) {

  //   this.onOpenLinkedMatter.emit(rowData);

  // }


  // onCreateMatterLinked() {

  //   const dialogRef = this.dialog.open(MatterLinkedDialogComponent, {
  //     width: '350px',
  //     height: '230px',
  //     data: null,    // { title: title },
  //     panelClass: 'dps-organizer-dialog',
  //     disableClose: true,
  //   });

  //   dialogRef.afterClosed().subscribe(plotNo => {
  //     if (plotNo) {
  //       this.onCreateLinkedMatter.emit(plotNo);
  //     }
  //   });

  // }

  // onSyncData() {
  //   this.savePlotSaleScreenData.emit();
  // }

  // onSelectAllMatter(value) {
  //   this.selectAllMatter.emit(value);
  // }

  // onMultiSelectMatter(value) {

  //   this.multiSelectMatter.emit(value);

  // }

  // onSyncChaser() {
  //   this.saveDiaryChaser.emit(this.selectedMatterData);
  // }

  // changePlotNo(value) {

  //   this.changePlotRange.emit(value);
  //   this.ischecked = false;

  // }

  // onPlotRangeClear() {
  //   this.changePlotRange.emit('');

  // }


}
