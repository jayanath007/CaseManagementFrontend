
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { OvItem } from '../../../../screen-desingner-core/models/application-component';
import { MatDialog } from '@angular/material';
import { RowOvItemChangeKind, ScreenListItemsChangeKind } from '../../../../screen-desingner-core/actions/core';
import { OvItemUpdateComponent } from '../ov-item-update/ov-item-update.component';
import { ScreenContanerComponent } from '../../../../screen-view-core/models/screen-contaner-component';

@Component({
  selector: 'dps-ov-item',
  templateUrl: './ov-item.component.html',
  styleUrls: ['./ov-item.component.scss']
})
export class OvItemComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  @Input()
  dataItem: OvItem;

  @Input()
  isShowDropInOvItem = false;

  @Output() onOvChange = new EventEmitter<{ kind: RowOvItemChangeKind, row: OvItem, value: any }>();

  @Output() onShowDropInOvItem = new EventEmitter<boolean>();

  @Output() onDropItem = new EventEmitter<{ dragItem: OvItem, dropContenerItem: OvItem }>();

  @Output()
  onComponentChange = new EventEmitter<{ kind: ScreenListItemsChangeKind, row: ScreenContanerComponent, value: any }>();


  onDragStart(event: DragEvent, item: OvItem) {
    if (item.onScreen) {
      setTimeout(() => {
        this.onShowDropInOvItem.emit(true);
      }, 0);
    }
    event.dataTransfer.setData('text', 'text/item;jsonString,' + JSON.stringify(item));
    console.log('onDragStart', event);
  }

  rowCheckChanged(event: DragEvent, dataItem) {
    event.preventDefault();
    event.stopPropagation();

    const item = { ...dataItem, isSelected: !dataItem.isSelected };
    this.onOvChange.emit({ kind: RowOvItemChangeKind.SelectItem, row: item, value: '' });

  }


  onDragEnd(event: DragEvent) {
    console.log('onDragEnd', event);
    event.preventDefault();
    setTimeout(() => {
      this.onShowDropInOvItem.emit(false);
    }, 0);
  }

  // isDropedItem = false;
  onDrop({ event, dragData, dragDataType }, dropContenerItem: OvItem) {
    event.preventDefault();
    this.onDropItem.emit({ dragItem: dragData, dropContenerItem: dropContenerItem });

    setTimeout(() => {
      this.onShowDropInOvItem.emit(false);
    }, 0);
  }

  onDragEnter(event, item) {

  }

  onOvItemChange(item: OvItem) {
    item.isNewItem = false;
    const updateItem = new OvItem({ ...item.screenComponentDto });
    updateItem.isSelected = item.isSelected;
    updateItem.onScreen = item.onScreen;
    updateItem.sequence = item.sequence;
    const confirmDialogRef = this.dialog.open(OvItemUpdateComponent, {
      width: '250px',
      panelClass: 'screen-edit-popoup',
      disableClose: true,
      data: { ovItem: updateItem, ovItemList: null }
    });

    confirmDialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult.kind !== RowOvItemChangeKind.CloseItem) {
        this.onOvChange.emit({ kind: RowOvItemChangeKind.UpdateValue, row: dialogResult.value, value: '' });
        this.onComponentChange.emit({
          kind: ScreenListItemsChangeKind.UpdateItemFromOVItemDto, row: null,
          value: dialogResult.value
        });
      }
    });
  }

  onOvIteminsert(insertOvItem) {

  }

  getClassByIconChange(value: number) {
    switch (value) {
      case 0:
        return 'fa fa-file-text';
      case 1:
        return 'fa fa-calendar';
      case 2:
        return 'fa fa-check-square';
      case 3:
        return 'fa fa-th-large';
      case 4:
        return 'fa fa-caret-square-o-down';
      case 5:
        return 'fa fa-gbp';
      case 6:
        return 'fa fa-list-ol';
      case 7:
        return 'fa fa-bars';
      case 8:
        return 'fa fa-clock-o';
      case 9:
        return 'fa fa-map-marker';
      case 10:
        return 'fa fa-paperclip';
      case 11:
        return 'fa fa-paperclip';
      case 12:
        return 'fa fa-map-marker';
      default:
        return '&nbsp;';
    }
  }


  ngOnInit() {

  }

}
