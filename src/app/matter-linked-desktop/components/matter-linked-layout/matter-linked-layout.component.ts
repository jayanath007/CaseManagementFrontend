import { ColumnDef } from './../../../core/lib/grid-model';
import { EventEmitter, Component, OnInit, OnChanges, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Mode } from '../../../core';
import {
  ConfirmDialogComponent, ConfirmDialogResultKind, InforDialogData,
  InforDialogComponent, ConfirmDialogData, ConfirmDialogComponentWithCancel, ConfirmDialogWithCancelResultKind
} from '../../../shared';
import { ConflictSaveType } from '../../../conflict-search-core/models/enum';
import { BillingGuideAnalysisType, BillingGuideSortBy, BillingGuideShowTime } from '../../../billing-guide-core/models/enum';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatterLinkedDialogComponent } from '../matter-linked-dialog/matter-linked-dialog.component';
import { GridData, PlotSyncSuccessInfo, MatterDataInput } from '../../../matter-linked-core/models/interfaces';
import { MatterLinkedType } from '../../../matter-linked-core';


@Component({
  selector: 'dps-matter-linked-layout',
  templateUrl: './matter-linked-layout.component.html',
  styleUrls: ['./matter-linked-layout.component.scss']

})
export class MatterLinkedLayoutComponent implements OnInit, OnChanges {

  @Input() inputData: any;
  @Input() matterRef: string;
  @Input() clientName: string;
  @Input() isLoading: boolean;
  @Input() gridData: GridData;
  @Input() isPopup: boolean;
  @Input() onlySelectMatter: boolean;
  @Input() coloumnDef: ColumnDef[];
  @Input() selectedMatterData: any;
  @Input() multiSelectItem: any;
  @Input() openFrom: MatterLinkedType;
  @Input() matterData: MatterDataInput;
  @Input() mode: Mode;
  @Input() title: string;
  @Input() plotRange: string;
  @Input() plotSyncSuccessInfo: PlotSyncSuccessInfo;


  @Output() closePopup = new EventEmitter<any>();
  @Output() submit = new EventEmitter();
  @Output() saveFile = new EventEmitter();
  @Output() onCreateLinkedMatter = new EventEmitter<string>();
  @Output() onOpenLinkedMatter = new EventEmitter<any>();
  @Output() selectedMatter = new EventEmitter<any>();
  @Output() savePlotSaleScreenData = new EventEmitter();
  @Output() selectAllMatter = new EventEmitter<any>();
  @Output() multiSelectMatter = new EventEmitter<any>();
  @Output() saveDiaryChaser = new EventEmitter();
  @Output() changePlotRange = new EventEmitter<any>();
  // @Output() changePlotRange = new EventEmitter<any>();


  Mode = Mode;

  matterLinkedType = MatterLinkedType;
  ischecked = false;


  constructor(private store: Store<any>, private dialog: MatDialog, private fb: FormBuilder, private datePipe: DatePipe) {

  }
  // docMatterLinkedGridColumn: ColumnDef[] = [
  //   createDefultColumnDef('documentRef', { label: 'Ref', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
  //   createDefultColumnDef('location', { label: 'Details', fxFlex: '', filterAnchor: 'end', filterHidden: true }),
  //   createDefultColumnDef('reviewDate', { label: 'Open', fxFlex: '150px', filterAnchor: 'end', filterHidden: true }),
  //   createDefultColumnDef('destroyDate', { label: 'Last Used', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
  //   createDefultColumnDef('destroyDate', { label: 'Start Date', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
  //   createDefultColumnDef('destroyDate', { label: 'F/E', fxFlex: '80px', filterAnchor: 'end', filterHidden: true }),
  // ];

  // docMatterSelectedColumn: ColumnDef[] = [
  //   createDefultColumnDef('documentRef', { label: 'Ref', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
  //   createDefultColumnDef('location', { label: 'Details', fxFlex: '', filterAnchor: 'end', filterHidden: true }),
  //   createDefultColumnDef('destroyDate', { label: 'Selected', fxFlex: '80px', filterAnchor: 'end', filterHidden: true }),
  // ];

  ngOnInit() { }



  ngOnChanges(changes: SimpleChanges) {

    if (changes.plotSyncSuccessInfo && !changes.plotSyncSuccessInfo.isFirstChange() && changes.plotSyncSuccessInfo.currentValue) {

      if (this.plotSyncSuccessInfo && this.plotSyncSuccessInfo.isSuccess) {
        this.openMSGPopup(this.plotSyncSuccessInfo.msg, 'alert', false);
      }
    }



  }

  openMSGPopup(msg, type, isClose) {
    const dialogData: InforDialogData = {
      content: {
        title: 'Plot Synchronization',
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
    dialogRef.afterClosed().subscribe(() => {
      this.onClose();

    });
  }

  onSelectedMatter(value) {
    this.selectedMatter.emit(value);
  }



  onClose() {


    this.closePopup.emit();

  }

  openLinkedMatter(rowData) {

    this.onOpenLinkedMatter.emit(rowData);

  }


  onCreateMatterLinked() {

    const dialogRef = this.dialog.open(MatterLinkedDialogComponent, {
      width: '350px',
      height: '230px',
      data: null,    // { title: title },
      panelClass: 'dps-organizer-dialog',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(plotNo => {
      if (plotNo) {
        this.onCreateLinkedMatter.emit(plotNo);
      }
    });

  }

  onSyncData() {
    this.savePlotSaleScreenData.emit();
  }

  onSelectAllMatter(value) {
    this.selectAllMatter.emit(value);
  }

  onMultiSelectMatter(value) {

    this.multiSelectMatter.emit(value);

  }

  onSyncChaser() {
    this.saveDiaryChaser.emit(this.selectedMatterData);
  }

  changePlotNo(value) {

    this.changePlotRange.emit(value);
    this.ischecked = false;

  }

  onPlotRangeClear() {
    this.changePlotRange.emit('');

  }


}
