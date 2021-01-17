import { RowScreenDefinitionChangeKind } from '../../../../screen-desingner-core/actions/core';
import { Contact } from '../../../../contact-core/models/interface';
import { ScreenDefinition, ScreenDefinitionDto } from '../../../../screen-view-core/models/screen-definition';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

import { ScreenContanerComponent, SdDataSource } from '../../../../screen-view-core/models/screen-contaner-component';
import { ScreenComponent } from '../../../../screen-view-core/models/screen-component';
import { ScreenListItemsChangeKind } from '../../../../screen-desingner-core/actions/core';

@Component({
  selector: 'dps-screen-parameters',
  templateUrl: './screen-parameters.component.html',
  styleUrls: ['./screen-parameters.component.scss']
})
export class ScreenParametersComponent implements OnInit {




  @Input()
  screenDefinition: ScreenDefinition;

  @Input()
  selectedContanerComponent: ScreenContanerComponent;

  @Output()
  onComponentChange = new EventEmitter<{ kind: ScreenListItemsChangeKind, row: ScreenDefinition, value: any }>();

  @Output()
  onScreenDefinitionChange = new EventEmitter<{ kind: RowScreenDefinitionChangeKind, row: ScreenDefinition, value: any }>();

  DataSourceList = [
    { sourceId: SdDataSource.Vars, sourceName: 'Application Variables' },
    { sourceId: SdDataSource.Contacts, sourceName: 'Contacts' },
  ];



  // to do

  onScreenTitleChange(screenTitle) {
    const component = new ScreenDefinition(this.screenDefinition.screenDefinitionDto, this.screenDefinition.mainState);
    component.setScreenTitleDefinition(screenTitle);
    this.onScreenDefinitionChange.emit({ kind: RowScreenDefinitionChangeKind.UpdateValue, row: component, value: '' });
  }

  onLoadFormChange(event) {

    const component = new ScreenDefinition(this.screenDefinition.screenDefinitionDto, this.screenDefinition.mainState);
    component.setDataSource(event.value);
    this.onScreenDefinitionChange.emit({ kind: RowScreenDefinitionChangeKind.UpdateValue, row: component, value: '' });


  }


  onContactTypeChange(event) {

    const component = new ScreenDefinition(this.screenDefinition.screenDefinitionDto, this.screenDefinition.mainState);
    component.setContactType(event.value);
    this.onScreenDefinitionChange.emit({ kind: RowScreenDefinitionChangeKind.UpdateValue, row: component, value: '' });

  }

  onOneOnlyPerMatter(value: boolean) {


    const component = new ScreenDefinition(this.screenDefinition.screenDefinitionDto, this.screenDefinition.mainState);
    component.setOneOnlyPerMatter(value);
    this.onScreenDefinitionChange.emit({ kind: RowScreenDefinitionChangeKind.UpdateValue, row: component, value: '' });



  }
  onLocked(value: boolean) {

    const component = new ScreenDefinition(this.screenDefinition.screenDefinitionDto, this.screenDefinition.mainState);
    component.setLocked(value);
    this.onScreenDefinitionChange.emit({ kind: RowScreenDefinitionChangeKind.UpdateValue, row: component, value: '' });



  }
  onMustValidate(value: boolean) {

    const component = new ScreenDefinition(this.screenDefinition.screenDefinitionDto, this.screenDefinition.mainState);
    component.setMustValidate(value);
    this.onScreenDefinitionChange.emit({ kind: RowScreenDefinitionChangeKind.UpdateValue, row: component, value: '' });
  }

  onSaveScreenParameters() {


  }


  onSaveUsernameChanged(value: boolean) {
    alert(value);
  }
  constructor() { }

  ngOnInit() {
  }

}
