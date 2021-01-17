
// import { ShowValidationFailDialog, SHOW_VALIDATION_FAIL_MESSAGE } from './../../matter-linked-core/actions/core';

// import {map} from 'rxjs/operators';
// import { Injectable } from '@angular/core';
// import { Actions, Effect, ofType } from '@ngrx/effects';
// import { MatDialog } from '@angular/material';
// import { FailDialogComponent } from '../../shared';
// import { UrlPopupService } from '../../shell-desktop/services/url-popup.service';


// @Injectable()
// export class UserMovementEffects {
//     constructor(private actions$: Actions, private dialog: MatDialog, private urlPopupService: UrlPopupService) { }


//     @Effect({ dispatch: false })
//     showValidationFailMessge$ = this.actions$.pipe(ofType<ShowValidationFailDialog>(SHOW_VALIDATION_FAIL_MESSAGE),
//         map((action) => {
//             const dialogRef = this.dialog.open(FailDialogComponent, {
//                 data: action.data,
//                 width: '400px',
//                 disableClose: true,
//                 hasBackdrop: true,
//                 panelClass: 'dps-notification'
//             });
//         }));

// }

