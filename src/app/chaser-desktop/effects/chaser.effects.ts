
import { MatterLinkedType } from './../../matter-linked-core/models/enum';

import { map, switchMap, take } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { ChaserOutPutType, LoadContacRoleSuccess, LOAD_CONTACT_ROLE_SUCCESS } from '../../chaser-core';
import { UnlinkEmailAddressesComponent } from '../components/unlink-email-addresses/unlink-email-addresses.component';
import { ConfirmDialogData, ConfirmDialogComponent, ConfirmDialogResultKind } from '../../shared';
import {
    LoadChaserTypeValidation, LOAD_CHASER_TYPE_VALIDATION, ChaserLoadingDisable,
    SendChaserEmailSuccess,
    LoadLinkedMatterPopup,
    LOAD_LINKED_MATTER_POPUP
} from '../../chaser-core/actions/core';
import { UrlPopupService } from '../../shell-desktop/services/url-popup.service';
import { Store } from '@ngrx/store';
import { SystemJsPopupLoaderService } from '../../shell-desktop/services/system-js-popup-loader.service';
import { getGeneralAllMenueItems } from '../../layout-desktop';


@Injectable()
export class ChaserEffects {

    constructor(protected store: Store<any>,
        private actions$: Actions,
        private dialog: MatDialog,
        private urlPopupService: UrlPopupService,
        private popupService: SystemJsPopupLoaderService,
    ) { }

    @Effect({ dispatch: false })
    openContacLinkPopUp$ = this.actions$.pipe(ofType<LoadContacRoleSuccess>(LOAD_CONTACT_ROLE_SUCCESS),
        map(action => {
            const dialogRef = this.dialog.open(UnlinkEmailAddressesComponent, {
                data: null,
                width: '600px',
                disableClose: true,
                hasBackdrop: true,
                panelClass: 'dps-notification'
            });
            const link = dialogRef.componentInstance.onLink.subscribe((emailAddress) => {
                alert(emailAddress);
            });
            dialogRef.afterClosed().subscribe(() => {
                link.unsubscribe();
            });
        }));

    @Effect({ dispatch: false })
    chaserTypeValidationPopUp$ = this.actions$.pipe(ofType<LoadChaserTypeValidation>(LOAD_CHASER_TYPE_VALIDATION),
        map(action => {
            const dialogData: ConfirmDialogData = {
                content: {
                    title: 'Message . . .',
                    message: `<p>Email sent successfully but related diary record didn’t add. Do you want to retry?</p><p>Hint: ` +
                        action.payload.errorMsg + '</p>',
                    acceptLabel: 'Yes',
                    rejectLabel: 'No'
                },
                contentParams: {},
                data: null
            };
            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                data: dialogData,
                width: '400px',
                disableClose: true,
                hasBackdrop: true,
                panelClass: 'dps-notification'
            });
            dialogRef.afterClosed().subscribe((result) => {
                if (window.opener && window.opener !== window) {
                    if (result && result.kind === ConfirmDialogResultKind.Confirmed) {
                        // call action for loader disable
                        this.store.dispatch(new ChaserLoadingDisable(action.token));
                    } else {
                        window.close();
                    }
                } else {
                    if (result && result.kind === ConfirmDialogResultKind.Confirmed) {
                        this.store.dispatch(new ChaserLoadingDisable(action.token));
                        this.popupService.openChaserPopup('CHASER_POPUP', null).subscribe((data: ChaserOutPutType) => {
                        });
                        // const encodeId = encodeURIComponent(action.payload.emailmodelData.Id);
                        // const urlPath = `/mail-item/${encodeURIComponent(btoa('me'))}/` + encodeId;
                        // const opened = this.urlPopupService.openWithUrlPoup(urlPath, action.payload.emailmodelData.Id, false, false);
                    }
                }
            });
        }));



    @Effect({ dispatch: false })
    openLinkedMatterPopUp$ = this.actions$.pipe(ofType<LoadLinkedMatterPopup>(LOAD_LINKED_MATTER_POPUP),
        switchMap(action => this.store.select(getGeneralAllMenueItems).pipe(take(1), map(menueItems => ({ menueItems, action })))),
        map(({ menueItems, action }) => {
            let title = 'Linked Matter';
            const menue = menueItems.find(val => val.id === 'matter_creation');
            if (menue) {
                title = 'Linked ' + menue.label;
            }
            const matterInfo = action.payload.selectedMatterInfo;
            this.popupService.openMatterLinkedPopup('ChaserLinkedMatter', matterInfo.matterReferenceNo,
                MatterLinkedType.Chaser, title, {
                appId: matterInfo.appID, branchID: matterInfo.branchID, fileID: matterInfo.fileID,
                isPlotMasterMatter: matterInfo.isPlotMasterMatter
            },
                null, action.payload.diaryIds)
                .subscribe((result: any) => {

                    if (!result) {
                        return '';
                    }
                });

        }));
}
