import { closePopup } from './../../../opportunity-core/reducers/index';
import { ColumnDef } from './../../../core/lib/grid-model';
import { EventEmitter, Component, OnInit, OnChanges, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MatCheckboxChange, MatMenuTrigger } from '@angular/material';
import { Mode } from '../../../core';
import {
  ConfirmDialogComponent, ConfirmDialogResultKind, InforDialogData,
  InforDialogComponent, ConfirmDialogData, ConfirmDialogComponentWithCancel, ConfirmDialogWithCancelResultKind
} from '../../../shared';
import { ConflictSaveType } from '../../../conflict-search-core/models/enum';
import { BillingGuideAnalysisType, BillingGuideSortBy, BillingGuideShowTime } from '../../../billing-guide-core/models/enum';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { UserMovementAddPopupComponent } from '../../containers/user-movement-add-popup.component';
import { UserMovementDesktopPopupComponent } from '../../containers/user-movement-desktop-popup.component';
import { TeamMember } from '../../../team-core/models/interface';
import { Observable } from 'rxjs';


@Component({
  selector: 'dps-user-movement-layout',
  templateUrl: './user-movement-layout.component.html',
  styleUrls: ['./user-movement-layout.component.scss']

})
export class UserMovementLayoutComponent implements OnInit, OnChanges {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @Input() myToken: any;
  @Input() inputData: any;
  @Input() departmentList: any;
  @Input() userList: TeamMember[];
  @Input() selectedTeamUser: any;
  @Input() currentDayMovementsList: any;
  @Input() isLoading: boolean;
  @Input() selectedUserInMovement: TeamMember;
  @Input() timeOffset: any;
  @Input() locationList: any[];

  @Output() selectUserInMovements = new EventEmitter<any>();
  @Output() closePopup = new EventEmitter<any>();
  @Output() changeUserDepartment = new EventEmitter<any>();
  @Output() userSerchtextChange = new EventEmitter<any>();
  @Output() changeUserLocation = new EventEmitter<any>();
  @Output() isAlldayEventChange = new EventEmitter<any>();


  Mode = Mode;

  constructor(
    private store: Store<any>, private dialog: MatDialog, private fb: FormBuilder, private datePipe: DatePipe) {


  }
  // docMatterLinkedGridColumn: ColumnDef[] = [
  //   createDefultColumnDef('documentRef', { label: 'Ref', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
  //   createDefultColumnDef('location', { label: 'Details', fxFlex: '', filterAnchor: 'end', filterHidden: true }),
  //   createDefultColumnDef('reviewDate', { label: 'Open', fxFlex: '150px', filterAnchor: 'end', filterHidden: true }),
  //   createDefultColumnDef('destroyDate', { label: 'Last Used', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
  //   createDefultColumnDef('destroyDate', { label: 'Start Date', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
  //   createDefultColumnDef('destroyDate', { label: 'F/E', fxFlex: '80px', filterAnchor: 'end', filterHidden: true }),
  // ];

  // docMatterSelectedColumn: ColumnDef[] = [
  //   createDefultColumnDef('documentRef', { label: 'Ref', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
  //   createDefultColumnDef('location', { label: 'Details', fxFlex: '', filterAnchor: 'end', filterHidden: true }),
  //   createDefultColumnDef('destroyDate', { label: 'Selected', fxFlex: '80px', filterAnchor: 'end', filterHidden: true }),
  // ];

  ngOnInit() {
    window.addEventListener('resize', (event) => {
      this.trigger.closeMenu();
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.addNewMovementpopupClose && !changes.addNewMovementpopupClose.isFirstChange()
      && changes.addNewMovementpopupClose.currentValue) {
      // this.dialog.

      //      this.dialogRef.afterClosed().subscribe(result => {
      //   {
      //     if (result) {
      //       //    this.xdraftItem.emit({ kind: emitKind, row: item, value: result });
      //     } else {

      //     }
      //   }
      // });

      // if (changes.saved.currentValue.isError) {
      //   this.openMSGPopup(changes.saved.currentValue.msg, 'success', true);
      // }
    }
  }
  // onClose() {
  //   // this.dialogRef.close();
  // }
  onAddMovement() {
    // const inputdata = {
    //   token : this.inputData,
    //   selectedUser : this.selectedUserInMovement
    // };
    const dialogRef = this.dialog.open(UserMovementAddPopupComponent, {
      width: '400px',
      data: {
        selectedUserInMovement: this.selectedUserInMovement ? this.selectedUserInMovement : null,
        myToken: this.myToken,
      },
      panelClass: 'dps-team-notification',
      disableClose: true,
    });
    // dialogRef.afterClosed().subscribe(result => {

    //     if (result) {
    //       this.close.emit();
    //     }

    // });
  }

  stopPropgation(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  getLocation() {
    if (this.locationList && this.locationList.length > 0) {
      return this.locationList.map(a => a.branchName);
    }
    return [];
  }

  onChangeMovementLocation(event) {
    this.changeUserLocation.emit(event);
  }

  onChangeDepartment(event) {

    this.changeUserDepartment.emit(event.value);
  }
  onSearchTextChanged(value, event?: MouseEvent) {
    if (event) {
      this.stopPropgation(event);
    }
    this.userSerchtextChange.emit(value);
  }
  onSelectUserInMovements(user) {
    this.selectUserInMovements.emit(user);
  }

  onIsAllDayEventChange(event: MatCheckboxChange) {

    this.isAlldayEventChange.emit(event.checked);

  }

  // closeMyMenu() {
  //   this.trigger.closeMenu();

  // }

}


// const buttonRight = document.getElementById('slideRight');
// const buttonLeft = document.getElementById('slideLeft');

// buttonRight.onclick = function () {
//   document.getElementById('container').scrollLeft += 20;
// };
// buttonLeft.onclick = function () {
//   document.getElementById('container').scrollLeft -= 20;
// };
