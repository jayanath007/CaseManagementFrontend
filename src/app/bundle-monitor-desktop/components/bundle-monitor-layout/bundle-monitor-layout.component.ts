
import { debounceTime } from 'rxjs/operators';
import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { ColumnDef } from '../../../core/lib/grid-model';
import { PDFBundleHeaderViewModel } from '../../../core/lib/bundle';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'dps-bundle-monitor-layout',
  templateUrl: './bundle-monitor-layout.component.html',
  styleUrls: ['./bundle-monitor-layout.component.scss']
})
export class BundleMonitorLayoutComponent implements OnInit, AfterViewInit {

  constructor() { }

  @Input() columnDef: ColumnDef[];
  @Input() isLoading: boolean;
  @Input() itemsForList: { key: string, value: number | string }[];
  @Input() selectedItem: string;
  @Input() gridItems: PDFBundleHeaderViewModel[];
  @Input() searchBundleId: number;
  @Output() changeSelectedItem = new EventEmitter<string | number>();
  @Output() refresh = new EventEmitter();
  @Output() updateSearchId = new EventEmitter();
  @Output() openLog = new EventEmitter<string>();
  @Output() selectRow = new EventEmitter<{ value: boolean, id: number }>();
  @Output() deleteRows = new EventEmitter();

  fontSizeClass: string;
  inputCtrl = new FormControl();
  fontSize: number;
  fontSizeClassTag: string;
  buttonActiveClass: string;
  showContent = false;

  ngOnInit() {
    setTimeout(() => {
      this.showContent = true;
    }, 500);
    if (window.document) { // if loaded
      window.document.title = 'PDF Bundle Monitor'; // set title
    }
    this.fontSize = 0;
    this.fontSizeClassTag = 'font-increment-';
    this.buttonActiveClass = '';
  }

  ngAfterViewInit() {
    this.inputCtrl.valueChanges.pipe(
      debounceTime(500))
      .subscribe((value: string) => {
        this.updateSearchId.emit(value);
      });
  }

  onItemsForChange(itemValue: number | string) {
    this.changeSelectedItem.emit(itemValue);
  }
  onRefresh() {
    this.refresh.emit();
  }
  onFontSizeMinusClick() {
    if (this.fontSize > -3) {
      this.buttonActiveClass = 'active';
      this.fontSize -= 1;
      this.fontSizeClass = this.fontSizeClassTag + this.fontSize;
    }
  }
  onFontSizeResetClick() {
    this.buttonActiveClass = '';
    this.fontSize = 0;
    this.fontSizeClass = this.fontSizeClassTag + this.fontSize;
  }
  onFontSizePlusClick() {
    if (this.fontSize < 4) {
      this.buttonActiveClass = 'active';
      this.fontSize += 1;
      this.fontSizeClass = this.fontSizeClassTag + this.fontSize;
    }
  }
  onOpenLog(bundleId) {
    this.openLog.emit(bundleId);
  }
  onSelectRow(event) {
    this.selectRow.emit(event);
  }
  onDelete() {
    this.deleteRows.emit();
  }
}
