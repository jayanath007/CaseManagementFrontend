import { Component } from '@angular/core';

@Component({
  selector: 'dps-user-movement-desktop-popup',
  template: `<dps-user-movement-desktop-manager
  [myToken]="token"
   #manager>
  <dps-user-movement-layout
  [myToken]="token"
  [departmentList] = "manager.departmentList$ | async"
   [locationList]= "manager.locationList$ | async"
  [isLoading] = "manager.isLoading$ | async"
  [userList]= "manager.userList$ | async"
   [timeOffset]="(manager.user$ | async)?.general?.dateTimeOffset"
  [currentDayMovementsList]= "manager.currentDayMovementsList$ | async"
  [selectedUserInMovement]= "manager.selectedUserInMovement$ | async"
  (selectUserInMovements)="manager.onSelectUserInMovements($event)"
  (changeUserDepartment)="manager.onChangeUserDepartment($event)"
  (userSerchtextChange)="manager.onUserSerchtextChange($event)"
  (changeUserLocation)="manager.onChangeUserLocation($event)"
  (isAlldayEventChange)="manager.onChangeIsAllDayEvent($event)"


  >
  </dps-user-movement-layout>
  </dps-user-movement-desktop-manager>`,
  styles: []
})

export class UserMovementDesktopPopupComponent {
  token = 'userMovementPopup';
  constructor(
    // @Inject(MAT_DIALOG_DATA) public data: {
    //   token: string,
    //   userList: any;
    //   departmentList: any;
    // }, public dialogRef: MatDialogRef<UserMovementDesktopPopupComponent>, private dialog: MatDialog
  ) { }

  // onClose(event) {
  //   this.dialogRef.close(event);
  // }

}
