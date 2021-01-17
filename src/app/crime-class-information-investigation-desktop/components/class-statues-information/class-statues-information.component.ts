import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModelProperty, Controls } from './../../../crime-class-information-investigation-core/models/enum';
import { InvestigationClassInfo } from './../../../crime-class-information-investigation-core/models/interfaces';
import { ControlerProperty } from '../../../core/lib/crime-managment';

@Component({
  selector: 'dps-class-statues-information',
  templateUrl: './class-statues-information.component.html',
  styleUrls: ['./class-statues-information.component.scss']
})
export class ClassStatuesInformationComponent implements OnInit {


  @Input() infomationModel: InvestigationClassInfo;
  @Input() isLoading: boolean;
  @Input() controlProperty: ControlerProperty;
  @Input() isRecursive: boolean;
  @Output() changeModel = new EventEmitter<{ key: ModelProperty, value: any }>();
  @Output() closeReopenClass = new EventEmitter();
  modelProperty = ModelProperty;
  controler = Controls;

  ngOnInit() {
  }

  onChangeUserInput(key: ModelProperty, value: any) {
    this.changeModel.emit({ key: key, value: value });
  }

  onCloseReopenClass() {
    this.closeReopenClass.emit();
  }

}
