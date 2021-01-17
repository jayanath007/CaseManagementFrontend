import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SummeryViewType } from '../../../core/lib/crime-managment';
import { TotalData, LeadUfnTotalSummary } from '../../../crime-class-information-proceedings-core/models/interfaces';


@Component({
  selector: 'dps-current-total',
  templateUrl: './current-total.component.html',
  styleUrls: ['./current-total.component.scss']
})
export class CurrentTotalComponent implements OnInit {

  @Input() selectType: SummeryViewType;
  @Input() isLoading: boolean;
  @Input() isPinItem: boolean;
  @Input() total: TotalData;
  @Input() committedToCrownCourt: boolean;
  @Input() leadUfnTotalSummary: LeadUfnTotalSummary;
  @Output() viewTotalSummery = new EventEmitter<SummeryViewType>();
  @Output() hideTotal = new EventEmitter();
  @Output() pinUnpin = new EventEmitter();
  summeryViewType = SummeryViewType;


  constructor() { }

  ngOnInit() {
  }

  onPinUnPinItem() {

    this.pinUnpin.emit();
  }

  onMovesOver(type: SummeryViewType) {
    if (!this.isLoading && !this.isPinItem) {
      this.viewTotalSummery.emit(type);
    }
  }

  onMouseleave() {
    if (!this.isPinItem) {
      this.hideTotal.emit();
    }
  }

}
