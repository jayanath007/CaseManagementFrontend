import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TotalViewDisplayModel } from './../../../crime-class-information-investigation-core/models/interfaces';
import { SummeryViewType } from '../../../core/lib/crime-managment';

@Component({
  selector: 'dps-current-total',
  templateUrl: './current-total.component.html',
  styleUrls: ['./current-total.component.scss']
})
export class CurrentTotalComponent implements OnInit {

  @Input() data: TotalViewDisplayModel;
  @Input() selectType: SummeryViewType;
  @Input() isLoading: boolean;
  @Input() isPinItem: boolean;
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
