import { Component, OnInit, Input, Output, EventEmitter, } from '@angular/core';
import { DropdownListData } from '../../../core';
import { SaveScreenItem } from '../../../opportunity-core/models/interfaces';

@Component({
  selector: 'dps-oppertunity-setting-screen-item',
  templateUrl: './oppertunity-setting-screen-item.component.html',
  styleUrls: ['./oppertunity-setting-screen-item.component.scss']
})
export class OppertunitySettingScreenItemComponent {

  @Input() appCodes: DropdownListData[];
  @Input() settingIsLoading: boolean;
  @Input() screen: { appId: number, list: DropdownListData[] }[];
  @Input() selectAppId?: number;
  @Input() screenName?: string;
  @Input() note?: string;
  @Input() isNew = false;
  @Input() addedScreenList: SaveScreenItem[] = [];
  @Output() changeAppId = new EventEmitter<number>();
  @Output() addItem = new EventEmitter<SaveScreenItem>();
  @Output() editItem = new EventEmitter<{ key: string, value: any }>();
  @Output() removeItem = new EventEmitter();
  @Output() changeNewItem = new EventEmitter<string>();

  newSelectAppId: number;
  newScreenName = '';
  newNote = '';
  screenFilterText = null;

  constructor() { }

  onAppCodeChanged(value) {
    this.changeAppId.emit(value);
    if (this.isNew) {
      this.newSelectAppId = value;
      this.changeNewItem.emit(value);
    } else {
      this.onEditItem('appId', value);
    }

  }

  getDisplayScreenList(appId: number) {
    const screen = this.screen.find(i => i.appId === appId);
    return !!screen ? screen.list.filter(i => {
      if (this.addedScreenList && this.addedScreenList.find(li => (li.appId === appId && li.screenName === i.key.toString()) && this.screenName !== li.screenName)) {
        return false;
      } else if (!!this.screenFilterText) {
        return i.key.toString().toLowerCase().indexOf(this.screenFilterText) > -1;
      }
      return true;
    }) : [];
  }

  onFilterScreen(text) {
    this.screenFilterText = text;
  }

  onAddItem() {
    this.addItem.emit({ appId: this.newSelectAppId, screenName: this.newScreenName, note: this.newNote });
    this.newSelectAppId = null;
    this.newScreenName = null;
    this.newNote = null;
    this.changeNewItem.emit(null);
  }

  onScreenChanged(value) {
    if (this.isNew) {
      this.newScreenName = value;
      this.newNote = this.getScreenTitleById(this.newSelectAppId, value);
    } else {
      this.onEditItem('screenName', value);
      this.onEditItem('note', this.getScreenTitleById(this.selectAppId, value));
    }


  }
  changeNote(evnet) {
    if (this.isNew) {
      this.newNote = evnet.value;
    } else {
      this.onEditItem('note', evnet.value);
    }
  }

  onEditItem(key: string, value: any) {
    this.editItem.emit({ key: key, value: value });
  }

  getScreenTitleById(appId, screenId): string {
    return this.getDisplayScreenList(appId).
      find(i => i.key === screenId).value;
  }

  onRemoveItem() {
    this.removeItem.emit();
  }

  clickOnScreenList(appId: number, event: MouseEvent) {
    const list = this.getDisplayScreenList(appId);
    if (!list || list.length === 0) {
      event.stopPropagation();
      this.changeAppId.emit(appId);
    }
  }

  onClearAddItem() {
    if (this.isNew) {
      this.newSelectAppId = null;
      this.newScreenName = '';
      this.newNote = '';
      this.changeNewItem.emit(null);
    }
  }




}
