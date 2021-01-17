import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReplaySubject ,  Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ScreenEditComponentTreeData } from '../../../core';

@Component({
  selector: 'dps-edit-screen-branch-select',
  templateUrl: './edit-screen-branch-select.component.html',
  styleUrls: ['./edit-screen-branch-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditScreenBranchSelectComponent implements OnInit, OnDestroy {

  @Input() dataSourseItems: any;
  @Input() noEntriesFoundLabel: string;
  @Input() placeholderLabel: string;
  @Input() meta: ScreenEditComponentTreeData;
  @Input() modelData: any;


  @Output() branchFilterchanged = new EventEmitter<string>();
  @Output() branchSelectionchanged = new EventEmitter<any>();

  constructor() { }

  /** Subject that emits when the component has been destroyed. */
  private _onDestroy = new Subject<void>();

  ngOnInit() {

  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  private filterbranches(value) {
    this.branchFilterchanged.emit(value);
  }
  branchSelectionChange(value) {
    this.branchSelectionchanged.emit(value);
  }
  get selectedBranch() {
    if (this.dataSourseItems) {
      return this.dataSourseItems.find((branch) => branch.selected);
    }
    return this.dataSourseItems;
  }
}
