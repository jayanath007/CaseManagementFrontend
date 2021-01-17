import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InvestigationClassInfo } from '../../../crime-class-information-investigation-core/models/interfaces';
import { ModelProperty, Controls } from '../../../crime-class-information-investigation-core/models/enum';
import { DropDownItem, ControlerProperty } from '../../../core/lib/crime-managment';

@Component({
  selector: 'dps-class-information',
  templateUrl: './class-information.component.html',
  styleUrls: ['./class-information.component.scss']
})
export class ClassInformationComponent implements OnInit {

  constructor() { }

  @Input() infomationModel: InvestigationClassInfo;
  @Input() stageReachedList: DropDownItem[];
  @Input() matterTypeList: DropDownItem[];
  @Input() outComeCode: DropDownItem[];
  @Input() controlProperty: ControlerProperty;
  @Input() isRecursive: boolean;
  @Output() changeModel = new EventEmitter<{ key: ModelProperty, value: any }>();
  @Output() btnAdvoAssiClick = new EventEmitter();
  controler = Controls;
  modelProperty = ModelProperty;

  ngOnInit() {
  }

  onChangeUserInput(key: ModelProperty, value: any) {
    this.changeModel.emit({ key: key, value: value });
  }

  onBtnAdvoAssiClick() {
    this.btnAdvoAssiClick.emit();
  }

}
