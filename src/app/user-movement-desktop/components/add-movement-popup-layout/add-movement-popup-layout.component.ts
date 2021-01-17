import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { AddMovementDetailsViewModel } from '../../../user-movement-core/models/interfaces';
import { MatDialogRef } from '@angular/material';


@Component({
  selector: 'dps-add-movement-popup-layout',
  templateUrl: './add-movement-popup-layout.component.html',
  styleUrls: ['./add-movement-popup-layout.component.scss']
})
export class AddMovementPopupLayoutComponent implements OnInit, OnChanges  {
  @Input() myToken: string;
  @Input() data: any;
  @Input() addMovementloading: boolean;
  @Input() teamMovementData: any;
  @Input() nextAvailableTypes: any;
  @Input() addNewMovementpopupClose: number;
  @Input() timeList: string[];
  @Input() locationList: any;
  @Input() timeOffset: any;





  // @Input() isMovementLoading: boolean;

  @Output() submitUserMovemetDetails = new EventEmitter<AddMovementDetailsViewModel>();
  @Output() refreshUserMovementList = new EventEmitter();
  @Output() close = new EventEmitter();



  constructor(public dialogRef: MatDialogRef<AddMovementPopupLayoutComponent>) { }

  isMovementLoading = true;

  ngOnInit() {


  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.addNewMovementpopupClose && !changes.addNewMovementpopupClose.isFirstChange()
     && changes.addNewMovementpopupClose.currentValue) {
      this.dialogRef.close();
     this.refreshUserMovementList.emit();
    }
    }

  onClose(event) {
    this.dialogRef.close();

  }

  onSubmitUserMovemetDetails(event) {
    this.submitUserMovemetDetails.emit(event);
  }



}
