import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { DropDownItem } from '../../../core/lib/crime-managment';
import { ModelProperty } from '../../../crime-class-information-proceedings-core/models/enum';
import { ProceedingClassInfoViewModal } from '../../../crime-class-information-proceedings-core/models/interfaces';

@Component({
  selector: 'dps-class-information',
  templateUrl: './class-information.component.html',
  styleUrls: ['./class-information.component.scss']
})
export class ClassInformationComponent implements OnInit {

  constructor() { }

  @Input() infomationModel: ProceedingClassInfoViewModal;
  @Input() stageReachedList: DropDownItem[];
  @Input() matterTypeList: DropDownItem[];
  @Input() outComeCode: DropDownItem[];
  @Input() caseTypes: DropDownItem[];
  @Output() changeModel = new EventEmitter<{ key: ModelProperty, value: any }>();
  @Output() btnAdvoAssiClick = new EventEmitter();
  modelProperty = ModelProperty;

  ngOnInit() {
  }

  onChangeUserInput(key: ModelProperty, value: any) {
    this.changeModel.emit({ key: key, value: value });
  }

}
