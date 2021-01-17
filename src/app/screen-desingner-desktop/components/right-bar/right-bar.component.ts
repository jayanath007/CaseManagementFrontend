import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ScreenContanerComponent } from '../../../screen-view-core/models/screen-contaner-component';
import { ScreenListItemsChangeKind, RowScreenDefinitionChangeKind } from '../../../screen-desingner-core/actions/core';
import { ScreenDefinition } from '../../../screen-view-core/models/screen-definition';
import { MatTabChangeEvent } from '@angular/material';

@Component({
  selector: 'dps-right-bar',
  templateUrl: './right-bar.component.html',
  styleUrls: ['./right-bar.component.scss']
})
export class RightBarComponent implements OnInit {

  constructor() { }


  @Input()
  selectedContanerComponent;

  @Input()
  screenComponentList;

  @Input()
  screenDesingnerState;

  @Input()
  masageCount;

  @Input()
  lookupFiles;

  @Input()
  screenDefinition;

  @Input()
  activeTab;

  @Output()
  onComponentChange = new EventEmitter<{ kind: ScreenListItemsChangeKind, row: ScreenContanerComponent, value: any }>();

  @Output()
  onScreenDefinitionChange = new EventEmitter<{ kind: RowScreenDefinitionChangeKind, row: ScreenDefinition, value: any }>();

  @Output()
  onGetlookUpData = new EventEmitter<{ payload: { appId: number } }>();

  @Output()
  onSave = new EventEmitter<{ importXMLPath: string, rearrange: boolean }>();

  @Output()
  changeSelectedTab = new EventEmitter<Number>();

  @Output()
  onCreateLookup = new EventEmitter<{ row: ScreenContanerComponent, value: any }>();


  onItemChange(event) {
    this.onComponentChange.emit(event);
  }
  onScreenTitleChange(event) {
    this.onScreenDefinitionChange.emit(event);
  }
  onlookUpData(event) {
    this.onGetlookUpData.emit(event);
  }

  save() {
    this.onSave.emit({ importXMLPath: '', rearrange: false });
  }

  createLookup(event) {
    this.onCreateLookup.emit(event);
  }


  ngOnInit() {
  }
  onChangeTap(tab: MatTabChangeEvent) {
    this.changeSelectedTab.emit(tab.index);
  }

}
