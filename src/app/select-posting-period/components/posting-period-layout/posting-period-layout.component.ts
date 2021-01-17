import { PosingPeriod } from './../../../setting-core';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dps-posting-period-layout',
  templateUrl: './posting-period-layout.component.html',
  styleUrls: ['./posting-period-layout.component.scss']
})
export class PostingPeriodLayoutComponent implements OnInit {

  @Input() dataLoading: boolean;
  @Input() postingPeriodList: PosingPeriod[];
  @Input() selectedPostingPeriod: PosingPeriod;

  @Output() postingPeriodClose = new EventEmitter<any>();
  @Output() setSelectedPostingPeriod = new EventEmitter<PosingPeriod>();

  selectedRow: PosingPeriod = null;

  constructor() { }

  ngOnInit() {
  }
  onClose(value) {
    this.postingPeriodClose.emit(value);
  }
  onRowSelect(item: PosingPeriod) {
    this.selectedRow = item;
  }
  onRowDblClickUpdate(item: PosingPeriod) {
    this.selectedRow = item;
    this.setSelectedPostingPeriod.emit(this.selectedRow);
    this.onClose({ posingPeriod: this.selectedRow });
  }
  onRowSelectUpdate() {
    if (this.selectedRow) {
      this.setSelectedPostingPeriod.emit(this.selectedRow);
      this.onClose({ posingPeriod: this.selectedRow });
    }
  }
}
