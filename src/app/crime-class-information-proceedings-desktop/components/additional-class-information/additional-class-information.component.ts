import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProceedingClassInfoViewModal } from '../../../crime-class-information-proceedings-core/models/interfaces';
import { ModelProperty } from '../../../crime-class-information-proceedings-core/models/enum';

@Component({
  selector: 'dps-additional-class-information',
  templateUrl: './additional-class-information.component.html',
  styleUrls: ['./additional-class-information.component.scss']
})
export class AdditionalClassInformationComponent implements OnInit {

  constructor() { }

  @Input() infomationModel: ProceedingClassInfoViewModal;
  @Output() changeModel = new EventEmitter<{ key: ModelProperty, value: any }>();
  @Output() openLocationSearch = new EventEmitter<string>();
  modelProperty = ModelProperty;

  ngOnInit() {
  }

  onChangeUserInput(key: ModelProperty, value: any) {
    this.changeModel.emit({ key: key, value: value });
  }



  onOpenLocationSearch(searchText) {
    this.openLocationSearch.emit(searchText);
  }


}
