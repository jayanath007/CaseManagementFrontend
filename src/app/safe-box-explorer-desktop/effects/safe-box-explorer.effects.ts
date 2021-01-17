
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { SystemJsPopupLoaderService } from '../../shell-desktop';
import { ItemView, ITEM_VIEW, ItemDownloadSuccess } from '../../safe-box-explorer-core';
import { DocumentViewPopupInput } from '../../document-view';
import { directViewExtentions } from '../../core';

@Injectable()
export class SafeBoxExplorerEffects {
    constructor(private actions$: Actions, private popupService: SystemJsPopupLoaderService) { }
    @Effect()
    signAndShareOrShare$ = this.actions$.pipe(ofType<ItemView>(ITEM_VIEW),
        switchMap((action) => {

            const input: DocumentViewPopupInput = {
                fileItem: { documentUrl: action.payload.viewUrl, data: { letter_icon: action.payload.extention } },
                signandSendToken: null,
                title: 'Safe Box Document',
                noSandBox: true
            };
            if (directViewExtentions.filter(p => p === action.payload.extention).length > 0) {
                return this.popupService.openDocumentViewPopup('DocumentViewPopup', input).pipe(map(data => {
                    return new ItemDownloadSuccess(action.token);
                }));
            } else {
                return of(new ItemDownloadSuccess(action.token));
            }

        }));
}
