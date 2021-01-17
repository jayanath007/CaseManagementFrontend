import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProceedingClassInfoViewModal } from '../../../crime-class-information-proceedings-core/models/interfaces';
import { ModelProperty } from '../../../crime-class-information-proceedings-core/models/enum';

@Component({
  selector: 'dps-representation-order-details',
  templateUrl: './representation-order-details.component.html',
  styleUrls: ['./representation-order-details.component.scss']
})
export class RepresentationOrderDetailsComponent implements OnInit {

  constructor() { }

  @Input() infomationModel: ProceedingClassInfoViewModal;
  @Output() changeModel = new EventEmitter<{ key: ModelProperty, value: any }>();
  modelProperty = ModelProperty;

  ngOnInit() {
  }

  onChangeUserInput(key: ModelProperty, value: any) {
    this.changeModel.emit({ key: key, value: value });
  }

}
