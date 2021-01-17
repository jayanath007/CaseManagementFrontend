import { Component, OnInit, Input, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { InforDialogComponent } from '../../shared/components/infor-dialog/infor-dialog.component';
import { InforDialogData, InforDialogResult } from '../../shared/models/dialog';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable ,  of } from 'rxjs';
import { MatDialog } from '@angular/material';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
// import { getPopupInputDataByTargetToken } from '../../layout-desktop/reducers';



@Component({
  selector: 'dps-initial-settings-popup',
  template: `<dps-initial-settings-manager [inputData]="data.input" [token]="data.token" (onClose)="onClose()">
  </dps-initial-settings-manager>`,
  styles: []
})
export class InitialSettingsPopupComponent implements OnInit, OnDestroy {

  isEnable$;

  // constructor(public dialogRef: MatDialogRef<InitialSettingsPopupComponent>,
  //   private store: Store<any>) { }

  constructor( @Inject(MAT_DIALOG_DATA) public data: { input: string, token: string },
    public dialogRef: MatDialogRef<InitialSettingsPopupComponent>, private dialog: MatDialog,
    private store: Store<any>) { }

  ngOnInit() {
    // this.isEnable$ = this.addNoteService.getIsTimeRecordingEnabled(this.data.input.matterData.MatterReferenceNo)
    //   .filter((value) => value !== null)
    //   .take(1)
    //   .switchMap((result) => {
    //     if (result) {
    //       return of(true);
    //     } else {
    //       const dialogData: InforDialogData = {
    //         content: {
    //           title: 'Add Note',
    //           message: 'Sorry...\nCurrent Spitfire version doesn\'t support this action on this matter.'
    //         },
    //         data: null
    //       };
    //       this.dialogRef.updateSize('400px', '0px');
    //       console.log('dialogData', dialogData);
    //       // popup dialog
    //       const dialogRef = this.dialog.open(InforDialogComponent, {
    //         data: dialogData,
    //         width: '400px',
    //         disableClose: true,
    //         hasBackdrop: false
    //       });
    //       return dialogRef.afterClosed().map<InforDialogResult, boolean>(dialogResult => {
    //         return false;
    //       });
    //     }
    //   }).do((result) => result === false ? this.dialogRef.close() : null).share();
  }



  ngOnDestroy(): void {

  }

  onClose() {
    this.dialogRef.close('success');
  }

}
