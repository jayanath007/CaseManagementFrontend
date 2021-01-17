import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Screen, SaveScreenItem } from '../../../opportunity-core/models/interfaces';
import { DropdownListData } from '../../../core';


@Component({
  selector: 'dps-opportunities-settings',
  templateUrl: './opportunities-settings.component.html',
  styleUrls: ['./opportunities-settings.component.scss']
})
export class OpportunitiesSettingsComponent implements OnChanges {

  screenFilterText = '';
  @Input() appCodes: DropdownListData[];
  @Input() settingIsLoading: boolean;
  @Input() screen: Screen[];
  @Input() addedScreenList: SaveScreenItem[];
  @Output() colse = new EventEmitter();
  @Output() changeAppId = new EventEmitter<number>();
  @Output() addItem = new EventEmitter<SaveScreenItem>();
  @Output() editScreenItem = new EventEmitter<{ index: number, key: string, value: any }>();
  @Output() removeScreenItem = new EventEmitter<number>();
  @Output() saveScreenList = new EventEmitter<number>();

  formatedscreenList: { appId: number, list: DropdownListData[] }[] = [];
  newItemAppId = null;
  submit = false;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.screen && !changes.screen.isFirstChange()) {
      this.onFormtedScreenList();
    }

  }

  onFilterScreenList(text: string) {
    this.screenFilterText = text;
  }

  onSaveScreenList() {
    this.submit = true;
    this.saveScreenList.emit(this.newItemAppId);
  }

  onAppCodeChanged(value) {
    this.changeAppId.emit(value);
  }
  onClose() {
    this.colse.emit();
  }
  onFormtedScreenList() {
    const temp: DropdownListData[] = [];
    if (!!this.screen && this.screen.length > 0) {
      this.screen.forEach(i => {
        i.screens.forEach(sc => {
          temp.push({
            key: sc.screenNumber,
            value: sc.screenTitle,
            description1: '',
            description2: '',
          });
        }
        );
        this.formatedscreenList.push({ appId: i.appId, list: temp });
      }
      );
    }
  }

  onAddItem(event: SaveScreenItem) {
    this.addItem.emit(event);
  }

  onEditItem(event: { key: string, value: any }, index: number) {
    this.editScreenItem.emit({ index: index, key: event.key, value: event.value });
  }

  onRemoveItem(index: number) {
    this.removeScreenItem.emit(index);
  }

  onChangeNewItem(appId) {
    this.submit = false;
    this.newItemAppId = appId;
  }

}
