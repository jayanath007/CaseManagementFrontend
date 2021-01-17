import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { AssetItemForDropDown, ControllersStyleSheet, EstateOverviewModel } from '../../models/interfce';
import { CommonControllerTypes } from '../../models/enums';

@Component({
  selector: 'dps-all-input-types',
  templateUrl: './all-input-types.component.html',
  styleUrls: ['./all-input-types.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AllInputTypesComponent implements OnInit {

  @Input() controllerType: string;
  @Input() controllerText: string;
  @Input() controllerName: string;
  @Input() controllerDisabled: boolean;
  @Input() controllerValueArray: Array<string>;
  @Input() styleSheet: ControllersStyleSheet;
  @Input() dataModel: EstateOverviewModel;
  @Input() liabilityAsset: AssetItemForDropDown[];
  @Input() exemptionAsset: AssetItemForDropDown[];

  @Output() valueChangedData = new EventEmitter<any>();

  CommonControllerTypes = CommonControllerTypes;

  constructor() { }

  ngOnInit() {
  }
  onValueChanged(type: CommonControllerTypes, value, modelName) {
    this.valueChangedData.emit({ controllerType: type, value: value, property: modelName });
  }
  onblurInputData(type: CommonControllerTypes, value, modelName) {
    this.valueChangedData.emit({ controllerType: type, value: value ? parseFloat(parseFloat(value).toFixed(2)) : 0, property: modelName });
  }
  onRadioButtonValueChanged(type: CommonControllerTypes, value, modelName) {
    if (modelName === 'isOwnedForTwoYearsYes') {
      this.valueChangedData.emit({ controllerType: type, value: (value === 'Yes' ? true : false), property: modelName });
    } else {
      this.valueChangedData.emit({ controllerType: type, value: value, property: modelName });
    }
  }
}
