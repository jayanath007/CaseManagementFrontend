import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { InvestigationClassInfo } from './../../../crime-class-information-investigation-core/models/interfaces';
import { ModelProperty } from './../../../crime-class-information-investigation-core/models/enum';

@Component({
  selector: 'dps-police-station-information',
  templateUrl: './police-station-information.component.html',
  styleUrls: ['./police-station-information.component.scss']
})
export class PoliceStationInformationComponent implements OnInit {

  constructor() { }

  @Input() infomationModel: InvestigationClassInfo;
  @Output() changeModel = new EventEmitter<{ key: ModelProperty, value: any }>();
  @Input() isRecursive: boolean;
  @Output() openPoliceStSearch = new EventEmitter<string>();
  modelProperty = ModelProperty;

  ngOnInit() {
  }

  onChangeUserInput(key: ModelProperty, value: any) {
    this.changeModel.emit({ key: key, value: value });
  }

  onOpenPoliceStationSearch(event: MouseEvent, searchText) {
    event.stopPropagation();
    if (!this.isRecursive) {
      this.openPoliceStSearch.emit(searchText);
    }

  }

}
