import { BaseCaseTimeManager } from '../../case-time-core/containers/base-case-time-manager';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as fileHistoryCore from '../../case-time-core';
import { ViewChangeKind, RowItemChangeKind } from '../../case-time-core/actions/core';
import { TimeItemWrapper } from '../../case-time-core/models/interface';
import { MatterInfo } from '../../core/lib/matter';
import { createDefultColumnDef } from '../../core/lib/grid-helpers';
import { FieldType } from '../../odata/enums';
import { GridButton } from '../../case-time-core/models/enum';
import { TimeRecordInputData } from '../../time-recording-core/models/interfaces';
import { SystemJsPopupLoaderService } from '../../shell-desktop';
import { TimeRecordingCloseInfo } from '../../time-recording-core/models/enum';
import { ConfirmDialogData, ConfirmDialogComponent, ConfirmDialogResultKind, InforDialogData, InforDialogComponent } from '../../shared';
import { DecimalPipe } from '@angular/common';
import { take, switchMap } from 'rxjs/operators';
import { dpsNewDate } from '../../utils/javascriptDate';

@Component({
  selector: 'dps-case-time-manager',
  template: `
  <dps-case-time-layout *ngIf="showContent && isContentReady"
  [fontSizeClass]="fontSizeClass"
  [matterInfo]="matterInfo"
  [token]="token"
  [caseTimeData]="caseTimeData$ | async"
  [pageInfo]="pageInfo$ | async"
  [columnDef]="columnDef$ | async"
  (viewChange)="onViewChange($event)"
  (rowChange)="onRowChange($event)"
  (gridButton)="onGridButtonClick($event)"
  >
  </dps-case-time-layout>
 `,
  styleUrls: []
})
export class CaseTimeManagerComponent extends BaseCaseTimeManager implements OnChanges {

  @Input()
  matterInfo: MatterInfo;
  public caseTimeData$: any;
  public searchText$: any;
  public pageInfo$: any;
  public columnDef$: any;

  @Input() token: string;
  @Input() refreshCount: number;
  @Input() showFDFigures: boolean;
  @Input() fontSizeClass: boolean;
  @Input() showContent: boolean;

  isContentReady: boolean;

  constructor(store: Store<any>, public popupService: SystemJsPopupLoaderService, private dialog: MatDialog,
    private decimalPipe: DecimalPipe) {
    super(store);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.matterInfo) {
      const columnDef = [
        createDefultColumnDef('Toggle', {
          label: '', fxFlex: '32px', filterAnchor: 'start', hidden: false, filterHidden: true,
          disableShort: true
        }),
        createDefultColumnDef('dateDone', { label: 'Date', fxFlex: '80px', filterAnchor: 'start', hidden: false }, FieldType.Date),
        createDefultColumnDef('feeEarner', { label: 'By', fxFlex: '50px', filterAnchor: 'start', hidden: false }),
        createDefultColumnDef('description', { label: 'Type', fxFlex: '10', filterAnchor: 'start', hidden: false, filterHidden: true }),
        createDefultColumnDef('details', { label: 'Details', fxFlex: '', filterAnchor: 'start', hidden: false, filterHidden: true }),
        createDefultColumnDef('units', { label: 'Units', fxFlex: '70px', filterAnchor: 'start', hidden: false }),
        createDefultColumnDef('rate', { label: 'Rate', fxFlex: '65px', filterAnchor: 'start', hidden: false, filterHidden: true }),
        createDefultColumnDef('usUnits', { label: 'Us-Units', fxFlex: '88px', filterAnchor: 'start', hidden: false, filterHidden: false }),
        createDefultColumnDef('usRate', { label: 'Us-Rate', fxFlex: '70px', filterAnchor: 'start', hidden: false, filterHidden: true }),
        createDefultColumnDef('value', { label: 'Amount', fxFlex: '125px', filterAnchor: 'end', hidden: false }),
        createDefultColumnDef('billed', {
          label: 'Billed? ', fxFlex: '55px', filterAnchor: 'end', hidden: !this.showFDFigures,
          filterHidden: true
        }),
        createDefultColumnDef('dateBilled', { label: 'Date Billed', fxFlex: '80px', filterAnchor: 'end', hidden: !this.showFDFigures }),
        createDefultColumnDef('netBilled', { label: 'Billed Amount', fxFlex: '125px', filterAnchor: 'end', hidden: !this.showFDFigures }),
        createDefultColumnDef('billNo', { label: 'Bill No.', fxFlex: '85px', filterAnchor: 'end', hidden: !this.showFDFigures }),
      ];

      this.token = 'InitCaseTime' + changes.matterInfo.currentValue.MatterReferenceNo;
      this.onChange(this.token, { columnDef: columnDef, matterInfo: this.matterInfo });
      this.caseTimeData$ = this.getCurrentGridData(this.token);
      this.searchText$ = this.getSearchText(this.token);
      this.columnDef$ = this.getColumnDef(this.token);
      // this.pageInfo$ = this.getPageEventByToken(this.token);
      this.pageInfo$ = this.store.select(fileHistoryCore.getCaseTimePageEventByToken(this.token));
      this.isContentReady = false;
      setTimeout(() => {
        this.isContentReady = true;
      }, 10);
    }

    if (changes.refreshCount && !changes.refreshCount.firstChange) {
      if (changes.matterInfo) {
        if (changes.matterInfo.previousValue === changes.matterInfo.currentValue) {
          this.refresh(this.token);
        }
      } else {
        this.refresh(this.token);
      }
    }
  }

  onRowChange(item) {
    this.store.dispatch(new fileHistoryCore.CaseTimeGridRowChange
      (this.token, { kind: RowItemChangeKind.IsExpand, row: item, value: '' }));
  }
  onViewChange(item) {
    this.store.dispatch(new fileHistoryCore.CaseTimeViewChange(this.token, item));
  }
  onSearchTextChanged(searchText) {
    this.store.dispatch(new fileHistoryCore.CaseTimeViewChange
      (this.token, { kind: ViewChangeKind.SearchText, value: searchText }));
  }

  onGridButtonClick(info: { kind: GridButton, row: TimeItemWrapper }) {
    switch (info.kind) {
      case GridButton.Edit: {
        this.user$.pipe(take(1)).subscribe(user => {
          const input: TimeRecordInputData = {
            matterReferenceNo: this.matterInfo.MatterReferenceNo,
            feeEarner: info.row.data.feeEarner,
            editData: {
              appId: this.matterInfo.AppId,
              appCode: this.matterInfo.AppCode,
              bigNote: '',
              billNo: info.row.data.billNo,
              billed: info.row.data.billed,
              branchId: this.matterInfo.BranchId,
              client: this.matterInfo.ClientName,
              clientName: this.matterInfo.ClientName,
              dateBilled: info.row.data.dateBilled,
              dateDone: info.row.data.dateDone,
              department: '',
              fileId: this.matterInfo.FileId,
              matter: this.matterInfo.MatterReferenceNo,
              matterReferenceNo: this.matterInfo.MatterReferenceNo,
              mpu: info.row.data.mpu,
              netBilled: info.row.data.netBilled,
              timeEditNote: '', // TimeEditNote
              postingDate: info.row.data.postingDate, // PostingDate
              rate: info.row.data.rate,
              reviewDate: dpsNewDate(user.general.dateTimeOffset),
              timeDetails: info.row.data.details,
              timeFeeEarner: info.row.data.feeEarner,
              timeUniqueRef: info.row.data.timeUniqueRef,
              units: info.row.data.units,
              value: info.row.data.value,
              timeEditDetails: info.row.data.details,
              timerValue: '',
              workType: info.row.data.workType,
              eBillingPhaseID: info.row.data.eBillingPhaseID,
              eBillingTaskID: info.row.data.eBillingTaskID,
              eBillingActivityID: info.row.data.eBillingActivityID,
              timeEventId: info.row.data.timeEventId
            },
            eBilling: this.matterInfo.eBilling,
          };
          this.popupService.openTimeRecordingPopup('TimeRecordingEditRecord-' + this.matterInfo.MatterReferenceNo, input)
            .subscribe((data) => {
              if (data === TimeRecordingCloseInfo.ExitWithSaveSuccess) {
                this.refresh(this.token);
              }
            });
        }).unsubscribe();

        break;
      }
      case GridButton.Delete: {
        if (info.row.data.billed && info.row.data.netBilled === 0) {
          const dialogData: InforDialogData = {
            content: {
              title: 'Delete',
              message: 'Cannot delete billed record.'
            },
            data: { messageType: 'alert' }
          };
          this.dialog.open(InforDialogComponent, {
            data: dialogData,
            width: '300px',
            disableClose: true,
            hasBackdrop: true,
            panelClass: 'dps-notification'
          });
        } else {
          let wipAmount = info.row.data.billed ? info.row.data.netBilled.toString() : info.row.data.value.toString();
          wipAmount = this.decimalPipe.transform(wipAmount, '1.2-2');
          const message = 'You are about to delete one or more items. The following rules will be applied: ' +
            '<br/> <br/> 1) Entries that have been billed in Accounts will not be deleted.' +
            '<br/> <br/> 2) Total (WIP) of £ ' + wipAmount + ' will be written off.' +
            '<br/> <br/> Are you sure you want to continue?';

          const dialogData: ConfirmDialogData = {
            content: {
              title: 'Delete',
              message: message,
            },
            contentParams: {},
            data: null
          };
          const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: dialogData,
            width: '600px',
            disableClose: true,
            panelClass: 'dps-notification'
          });

          dialogRef.afterClosed().subscribe(dialogResult => {
            if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
              this.store.dispatch(new fileHistoryCore.DeleteTime
                (this.token, { CaseTime: info.row, matterRef: this.matterInfo.MatterReferenceNo }));
            }
          });
        }
        break;
      }
      default:
        break;
    }
  }

}
