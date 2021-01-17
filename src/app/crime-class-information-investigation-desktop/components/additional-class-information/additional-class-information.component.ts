import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModelProperty } from '../../../crime-class-information-investigation-core/models/enum';
import { InvestigationClassInfo } from './../../../crime-class-information-investigation-core/models/interfaces';

@Component({
  selector: 'dps-additional-class-information',
  templateUrl: './additional-class-information.component.html',
  styleUrls: ['./additional-class-information.component.scss']
})
export class AdditionalClassInformationComponent implements OnInit {

  constructor() { }

  @Input() infomationModel: InvestigationClassInfo;
  @Input() isRecursive: boolean;
  @Output() changeModel = new EventEmitter<{ key: ModelProperty, value: any }>();
  modelProperty = ModelProperty;

  ngOnInit() {
  }

  onChangeUserInput(key: ModelProperty, value: any) {
    this.changeModel.emit({ key: key, value: value });
  }


}
