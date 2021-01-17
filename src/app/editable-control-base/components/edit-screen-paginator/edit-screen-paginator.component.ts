import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'dps-edit-screen-paginator',
  templateUrl: './edit-screen-paginator.component.html',
  styleUrls: ['./edit-screen-paginator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditScreenPaginatorComponent implements OnInit {
  @Input() pagesLength: number;
  @Input() pageIndex: number;
  @Input() hidden: boolean;
  @Input() disabled: boolean;

  @Output() changePage = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  onFirstPage() {
    this.changePage.emit(0);
  }
  onLastPage() {
    this.changePage.emit(this.pagesLength - 1);
  }
  onNextPage() {
    this.changePage.emit(this.pageIndex + 1);
  }
  onPreviousPage() {
    this.changePage.emit(this.pageIndex - 1);
  }
}
