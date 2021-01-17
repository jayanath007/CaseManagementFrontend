import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProceedingClassInfoViewModal } from '../../../crime-class-information-proceedings-core/models/interfaces';
import { ModelProperty } from '../../../crime-class-information-proceedings-core/models/enum';

@Component({
  selector: 'dps-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {

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


  onOpenlocationSearch(event: MouseEvent, searchText) {
    this.openLocationSearch.emit(searchText);
  }

}
