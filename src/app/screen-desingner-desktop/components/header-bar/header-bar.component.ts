import { ScreenLogicDocuments, ScreenLogic } from './../../../screen-desingner-core/models/screen-desingner-request';
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ScreenDefinition } from '../../../screen-view-core/models/screen-definition';



@Component({
  selector: 'dps-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss']
})
export class HeaderBarComponent implements OnInit {

  @Input()
  screenDefinition: ScreenDefinition;

  @Input()
  screenIds: Array<string>;

  @Input()
  curentIndex = 0;

  @Input()
  rightCollapse;

  @Input()
  leftCollapse;

  @Input()
  screenLogicDocuments: Array<ScreenLogicDocuments>;


  @Output() onNext = new EventEmitter<{ value: any }>();
  @Output() onPrev = new EventEmitter<{ value: any }>();
  @Output() onClose = new EventEmitter<{ value: any }>();
  @Output() onRightCollapse = new EventEmitter<boolean>();
  @Output() onLeftCollapse = new EventEmitter<boolean>();
  @Output() onLogicDodumentView = new EventEmitter<ScreenLogic>();
  @Output() onSave = new EventEmitter<{ importXMLPath: string, rearrange: boolean }>();
  @Output() onExportXMLList = new EventEmitter<any>();
  @Output() onCheckin = new EventEmitter<ScreenLogicDocuments>();
  @Output() onDiscardCheckin = new EventEmitter<ScreenLogicDocuments>();




  constructor(private dialogRef: MatDialogRef<HeaderBarComponent>, public dialog: MatDialog) { }





  doCheckin(item) {
    this.onCheckin.emit(item);
  }

  doDiscardCheckin(item) {
    this.onDiscardCheckin.emit(item);
  }

  isCheckoutFile(item: ScreenLogicDocuments) {
    return this.isCheckoutByMe(item) || item.checkedOutByUser && item.checkedOutByUser !== '';
  }

  isCheckoutByMe(item: ScreenLogicDocuments) {
    return item.checkedOutHashKey && item.checkedOutHashKey !== '';
  }







  prives() {
    this.onPrev.emit({ value: this.curentIndex });
  }
  next() {
    this.onNext.emit({ value: this.curentIndex });

  }

  closeDialog() {

    this.onClose.emit({ value: this.curentIndex });

  }

  xmlExport() {
    this.onExportXMLList.emit();
  }


  ngOnInit() {

  }

  save() {
    this.onSave.emit({ importXMLPath: '', rearrange: false });
  }

  leftCollapseMenu() {
    this.onLeftCollapse.emit();
  }

  rightCollapseMenu() {
    this.onRightCollapse.emit();
  }

  onLogic(item: ScreenLogicDocuments) {
    this.onLogicDodumentView.emit(item.id);
  }


}
