import { ScreenDefinition } from '../../../screen-view-core/models/screen-definition';
import { ScreenComponentDto } from '../../../screen-view-core/models/screen-contaner-component';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { OvItemUpdateComponent } from './ov-item-update/ov-item-update.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RowOvItemChangeKind, ScreenListItemsChangeKind } from '../../../screen-desingner-core/actions/core';
import { OvItem } from '../../../screen-desingner-core/models/application-component';
import { ScreenContanerComponent, UiComponentType } from '../../../screen-view-core/models/screen-contaner-component';
import { LabelUpdateComponent } from './label-update/label-update.component';


@Component({
  selector: 'dps-ov-list',
  templateUrl: './ov-list.component.html',
  styleUrls: ['./ov-list.component.scss']
})
export class OvListComponent implements OnInit {

  constructor(public dialog: MatDialog) { }


  @Input()
  selectedContanerComponent: ScreenContanerComponent;

  @Input()
  screenDefinition: ScreenDefinition;

  @Input()
  ovItemList;
  @Input()
  selectedOvItem;

  @Input()
  seachText;


  @Output()
  onOvChange = new EventEmitter<{ kind: RowOvItemChangeKind, row: OvItem, value: any }>();
  @Output()
  onComponentChange = new EventEmitter<{ kind: ScreenListItemsChangeKind, row: ScreenContanerComponent, value: any }>();

  @Output()
  onSearchTextChange = new EventEmitter<{ value: string }>();

  @Output()
  onExportOvList = new EventEmitter<any>();


  isShowDropInOvItem = false;
  viewPortItems = [];
  defultDataItem = { varNo: -1, sequence: 0, onScreen: true };
  windowInnerHeight = 900;

  // dragEnterItemVarNo = -567;

  onSearchChange(value) {
    this.onSearchTextChange.emit({ value: value });
  }

  onSearchClear(value) {
    value = '';
    this.onSearchTextChange.emit({ value: '' });
  }

  onOvItemChange(item: { kind: RowOvItemChangeKind, row: OvItem, value: any }) {
    this.onOvChange.emit(item);
  }

  onComponentChangeUpdate(event) {
    this.onComponentChange.emit(event);
  }

  onDropInOvItemChange(isShowDropInOvItem) {
    this.isShowDropInOvItem = isShowDropInOvItem;
  }
  onDrop(event: { dragItem: OvItem, dropContenerItem: OvItem }) {
    console.log('onDrop', event);
    if (event.dragItem.varNo !== event.dropContenerItem.varNo) {
      const sequence = (event.dropContenerItem.sequence + (event.dropContenerItem.sequence + 1)) / 2;
      this.onComponentChange.emit({
        kind: ScreenListItemsChangeKind.SequenceRearrangement, row: null,
        value: { varNo: event.dragItem.varNo, sequence: sequence }
      });
    }

  }
  onDragEnter(dragEnterItemVarNo) {
    // this.dragEnterItemVarNo = dragEnterItemVarNo;
  }

  getViewPortItems(array) {
    this.viewPortItems = array;
  }

  onDropItem(data: any, dropContenerItem: any) {
    data.event.preventDefault();
    this.onDrop({ dragItem: data.dragData, dropContenerItem: dropContenerItem });
  }
  onDragEnterItem(event, item) {

  }
  excelExport() {
    this.onExportOvList.emit();
  }

  createNewOvItemDto(): ScreenComponentDto {
    const item: ScreenComponentDto = {
      sC_ID: 1, sC_AppID: 0, sC_ScreenNo: 0, sC_VarNo: null, sC_Action: null, sC_Border: false, sC_Enabled: true, sC_Visible: true,
      sC_Mask: null, sC_Force: false, sC_Left: null, sC_Top: null, sC_TextCol: null, sC_BackCol: null, sC_Height: 21, sC_Sequence: null,
      sC_Multiline: false, sC_Protected: false, sC_Version: null, sC_Search: null, sC_TemplateLine: null, avD_ID: 0,
      avD_AppID: +this.screenDefinition.application,
      avD_VarNo: 0, avD_Type: UiComponentType.Text, avD_TypeText: '', avD_Length: 10, avD_Text: '', avD_Help: '',
      sD_ContactType: null, dM_CField: null, dM_TPID: null, lookup_Text: null, field_Value: null,
      error_Message: null, onScreen: false, onContact: false
    };
    return item;
  }

  ovAddLable() {

    const item = this.createNewOvItemDto();
    item.avD_Type = UiComponentType.Label;
    item.avD_TypeText = 'Label';
    item.sC_Top = 10;
    item.sC_Left = 10;
    item.sC_VarNo = 0;

    const newOvItem = new OvItem(item);
    const confirmDialogRef = this.dialog.open(LabelUpdateComponent, {
      width: '250px',
      data: newOvItem,
      disableClose: true,
      panelClass: 'screen-edit-popoup',
    });

    confirmDialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult.value.description) {
        this.onComponentChange.emit({
          kind: ScreenListItemsChangeKind.AddItem, row: null,
          value: dialogResult.value.screenComponentDto
        });
      }
    });

    // confirmDialogRef.beforeClose().subscribe(dialogResult => {
    //   if (dialogResult.value.description) {
    //     this.onComponentChange.emit({
    //       kind: ScreenListItemsChangeKind.AddItem, row: null,
    //       value: dialogResult.value.screenComponentDto
    //     });
    //   }
    // });
  }
  onOvEdit() {

    if (this.selectedOvItem.length === 1) {

      const item = { ...this.selectedOvItem[0] };
      item.isNewItem = false;
      const updateItem = new OvItem({ ...item.screenComponentDto });
      updateItem.isSelected = item.isSelected;
      updateItem.onScreen = item.onScreen;
      updateItem.sequence = item.sequence;
      const confirmDialogRef = this.dialog.open(OvItemUpdateComponent, {
        width: '250px',
        panelClass: 'screen-edit-popoup',
        data: { ovItem: updateItem, ovItemList: null },
        disableClose: true,
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


      // const newOvItem = { ...this.selectedOvItem[0] };
      // const confirmDialogRef = this.dialog.open(LabelUpdateComponent, {
      //   width: '250px',
      //   panelClass: 'screen-edit-popoup',
      //   data: newOvItem
      // });
      // confirmDialogRef.afterClosed().subscribe(dialogResult => {
      //   if (dialogResult.kind !== RowOvItemChangeKind.CloseItem) {
      //     this.onOvChange.emit({ kind: RowOvItemChangeKind.UpdateValue, row: dialogResult.value, value: '' });
      //     this.onComponentChange.emit({
      //       kind: ScreenListItemsChangeKind.UpdateItemFromOVItemDto, row: null,
      //       value: dialogResult.value
      //     });
      //   }
      // });


    }
  }



  ovIteminsert() {
    const item = this.createNewOvItemDto();
    item.avD_Type = UiComponentType.Text;
    item.avD_TypeText = 'Text';
    const newOvItem = new OvItem(item);
    newOvItem.isNewItem = true;
    const confirmDialogRef = this.dialog.open(OvItemUpdateComponent, {
      width: '250px',
      panelClass: 'screen-edit-popoup',
      disableClose: true,
      data: { ovItem: newOvItem, ovItemList: this.ovItemList }

    });
    confirmDialogRef.afterClosed().subscribe((dialogResult: { kind: RowOvItemChangeKind, value: OvItem }) => {

      if (dialogResult.kind !== RowOvItemChangeKind.CloseItem && dialogResult.value.varNo !== 0) {

        if (newOvItem.isNewItem) {
          
          this.onOvChange.emit({ kind: RowOvItemChangeKind.InsertItem, row: dialogResult.value, value: '' });

          if (dialogResult.kind === RowOvItemChangeKind.InsertItemAddToView) {

            this.onComponentChange.emit({
              kind: ScreenListItemsChangeKind.AddItem, row: null,
              value: dialogResult.value.screenComponentDto
            });
          }

        }
      }
    });
  }
  onOvDelete() {

    if (this.selectedOvItem.length > 0) {
      this.onOvChange.emit({ kind: RowOvItemChangeKind.DeleteItem, row: null, value: this.selectedOvItem });
    }

  }

  onOvAddField() {

  }
  ngOnInit() {
    this.windowInnerHeight = window.innerHeight;
  }



}
