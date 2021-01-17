import { InforDialogComponent } from '../../../shared/components/infor-dialog/infor-dialog.component';
import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { LookupViewModel } from '../../../core';
import { InforDialogData } from '../../../shared';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'dps-client-screen-lookup-header',
  templateUrl: './client-screen-lookup-header.component.html',
  styleUrls: ['./client-screen-lookup-header.component.scss']
})
export class ClientScreenLookupHeaderComponent implements OnInit {

  @Input() screenLookupList: LookupViewModel;

  @Output() changeDescriptionClick = new EventEmitter<any>();
  @Output() onAddNewLookupClick = new EventEmitter();
  @Output() onCancelChangesClick = new EventEmitter();
 // @ViewChild('luP_Code') private luP_Code: ElementRef;


  constructor(private dialog: MatDialog) { }


  onChangeDescription(event) {

    this.changeDescriptionClick.emit(event.target.value);

  }


  ngOnInit() {
  }

  addNewLookup() {
    if (this.screenLookupList && !this.screenLookupList.lookupViewModels.find(l => l.luP_Code === '')) {
      this.onAddNewLookupClick.emit();
    } else {

    const dialogData: InforDialogData = {
      content: {
        title: 'Warnning',
        message: `Display Name is required`
      },
      data: { messageType: 'warning' }
    };
    const dialogRef = this.dialog.open(InforDialogComponent, {
      data: dialogData,
      width: '400px',
      disableClose: true,
      panelClass: 'dps-notification',
      hasBackdrop: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {

     // this.luP_Code.nativeElement.focus();

    });



    }

  }

  onCancelChanges() {

    this.onCancelChangesClick.emit();

  }

}
