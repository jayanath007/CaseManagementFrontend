import { PageEvent } from '@angular/material';
import {
  Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter,
  SimpleChanges, OnChanges, OnDestroy, ChangeDetectorRef, HostListener
} from '@angular/core';
import { ColumnDef, PaginatorDef, GridGroupData } from '../../../core/lib/grid-model';
import { Filter, Condition } from '../../../odata';
import { GridData, SelectedInfo, GridButtonAction } from '../../../time-recorded-core/models/interfce';
import { ViewChangeKind, GroupMode } from '../../../time-recorded-core/models/enumeration';
import { TimeRecordingState } from '../../../time-recording-core';
import { StopStartInfo } from '../../../time-recording-core/models/enum';
import { GridButtonType } from '../../../time-recorded-core';
import { interval, Subscription } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
// import { DataSource } from '@angular/cdk/table';


@Component({
  selector: 'dps-time-recorded-grid',
  templateUrl: './time-recorded-grid.component.html',
  styleUrls: ['./time-recorded-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeRecordedGridComponent implements OnInit, OnChanges, OnDestroy {

  @Input() isLoading: boolean;
  @Input() homeCurrancy: string;
  @Input() columnDef: ColumnDef[];
  @Input() paginatorDef: PaginatorDef;
  @Input() totalItem: Number;
  @Input() searchText: string;
  @Input() gridData: GridData[];
  @Input() selectedInfo: SelectedInfo;
  @Input() groupMode: string;
  @Input() groupData: GridGroupData[];
  @Input() canMinimizeViews: { token: string; view: TimeRecordingState; isActive: boolean; }[];

  @Output() viewChange = new EventEmitter<any>();
  @Output() rowSelect = new EventEmitter();
  @Output() selectRow = new EventEmitter<GridData>();
  @Output() selectGroup = new EventEmitter<GridGroupData>();
  @Output() clickGridButton = new EventEmitter<GridButtonAction>();
  @Output() loadMoreData = new EventEmitter<GridGroupData>();

  @Output() timeUpdateValue = new EventEmitter<number>();
  @Output() timeUpdateStartStop = new EventEmitter<any>();
  @Output() saveTimeRecording = new EventEmitter<any>();

  length = 50;
  pageSize = 50;
  pageSizeOptions = [25, 50, 100];
  pageIndex = 0;
  // matterFinanceData: any;

  GroupMode = GroupMode;
  dateTimeNow = 0;
  interval: Subscription;
  stopStartState = { token: null, state: null };
  divWidth;
  noOfElement;
  showItems;
  forContexMenu;

  constructor(private ref: ChangeDetectorRef, private breakpointObserver: BreakpointObserver) { }


  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    if (this.canMinimizeViews.find(item => item.isActive && item.view.isTimeRecordStart)) {

      const message = 'Changes you made may not be saved.';
      event.returnValue = message;
      return message;
    }
  }

  ngOnInit() {
    interval(600000).subscribe(func => {
      this.canMinimizeViews.forEach((item) => {
        if (item.isActive && item.view.isTimeRecordStart && item.view.isMinimize) {
          this.saveTimeRecording.emit(item.token);
          return;
        }
      });
    });

    window.addEventListener('resize', (event) => {
      this.calShowTabCount();
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.canMinimizeViews) {
      this.calShowTabCount();
    }
    if (changes.canMinimizeViews && changes.canMinimizeViews.currentValue && changes.canMinimizeViews.currentValue.length > 0 &&
      (!this.interval || this.interval.closed)) {

      this.interval = interval(1000).subscribe(val => {
        this.timeUpdateValue.emit();
        // this.dateTimeNow = new Date().getTime();
        // this.ref.detectChanges();
      });
    } else if (changes.canMinimizeViews && changes.canMinimizeViews.currentValue && changes.canMinimizeViews.currentValue.length < 1 &&
      (this.interval && !this.interval.closed)) {
      this.interval.unsubscribe();
    }
  }

  ngOnDestroy() {
    if (this.interval && !this.interval.closed) {
      this.interval.unsubscribe();
    }
  }

  public onNextPage(pageEvent: PageEvent): void {
    const pageDef: PaginatorDef = { currentPage: pageEvent.pageIndex, itemPerPage: pageEvent.pageSize };
    this.viewChange.emit({ kind: ViewChangeKind.PageChange, value: pageDef });
  }

  onFilterApply(data: { filter: Filter<Condition>, def: ColumnDef }) {
    if (data.filter.filters[0].value.toString().trim()) {
      const filterDef: ColumnDef = { fieldName: data.def.fieldName, filter: data.filter, filterActive: true };
      this.viewChange.emit({ kind: ViewChangeKind.ApplyColumnFilter, value: filterDef });
    }
  }

  onFilterClear(data: { filter: Filter<Condition>, def: ColumnDef }) {
    const filterDef: ColumnDef = { fieldName: data.def.fieldName, filter: data.filter, filterActive: false };
    this.viewChange.emit({ kind: ViewChangeKind.ClearColumnFilter, value: filterDef });
  }

  onToggleSorting(def: ColumnDef) {
    if ((def.fieldName !== 'Billed') && (def.fieldName !== 'BillFE') && (def.fieldName !== 'BillNo')) {
      this.viewChange.emit({ kind: ViewChangeKind.ToggleFieldSort, value: def });
    }
  }

  onSelectRow(item: GridData) {
    this.selectRow.emit(item);
  }

  onSelectGroup(data: GridGroupData) {
    this.selectGroup.emit(data);
  }

  onClickGridButton(action: GridButtonAction) {
    // this.stopStartState = StopStartInfo.Start;
    this.clickGridButton.emit(action);
  }

  loadMore(data) {
    this.loadMoreData.emit(data);
  }
  // onSelectedTabChange(event) {
  //   debugger
  // }
  get selectedIndex() {
    return this.canMinimizeViews.findIndex(val => val.isActive);
  }
  onSelectedIndexChange(index: number) {
    // const view = this.canMinimizeViews[index];
    // if (view && !view.isActive) {
    //   this.clickGridButton.emit({ kind: GridButtonType.addTimeRecording, value: null, token: view.token });
    // }
  }
  onOpenTimeRecording(view: { token: string; view: TimeRecordingState; isActive: boolean; }) {
    this.clickGridButton.emit({ kind: GridButtonType.addTimeRecording, value: null, token: view.token });
  }
  onStopStartTimeRecording(view: { token: string; view: TimeRecordingState; isActive: boolean; }, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (view.isActive) {
      this.saveTimeRecording.emit(view.token);
    }
    this.timeUpdateStartStop.emit(view.token);
  }
  getTimeRecord(time: number) {
    const datetime = time * 1000;
    if (datetime < 0) {
      return '0s';
    }
    const days = Math.floor(datetime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((datetime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((datetime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((datetime % (1000 * 60)) / 1000);
    if (days > 0) {
      return days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's';
    }
    if (hours > 0) {
      return hours + 'h ' + minutes + 'm ' + seconds + 's';
    }
    if (minutes > 0) {
      return minutes + 'm ' + seconds + 's';
    }
    return seconds + 's';
  }
  calShowTabCount() {
    if (document.getElementById('tabPannel')) {
      this.divWidth = document.getElementById('tabPannel').clientWidth;
      this.noOfElement = Math.floor(this.divWidth / 150);
      this.showItems = this.canMinimizeViews.slice(0, this.noOfElement);
      this.forContexMenu = this.canMinimizeViews.slice(this.noOfElement, this.canMinimizeViews.length);
    }
  }
}


