
import { tap, switchMap, map, filter, catchError, mergeMap, take, delayWhen } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { Actions, ofType, } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of, timer } from 'rxjs';
import * as Item from '../actions/item';
import { MsgraphClientMailItemService } from '../services/msgraph-client-mail-item.service';
import { FileUrlResolverService, OpenByUrl } from '../../document-view';
import { getUser } from '../../auth';
import { centerToWindow } from '../../utils/bounds';

export abstract class ItemEffectBase {
    constructor(protected actions$: Actions, protected store: Store<any>, public snackBar: MatSnackBar,
        protected urlResolver: FileUrlResolverService, protected mailItemService: MsgraphClientMailItemService) { }

    // protected _cacheAttachmentUrl$ = this.actions$.pipe(ofType<Item.CacheAttachmentUrl>(Item.CACHE_ATTACHEMNT_URL),
    //     map(action => action.payload),
    //     switchMap((data) => {
    //         if (data.item.data.attachments) {
    //             const fileAtt = data.item.data.attachments
    //                 .filter(att => att.isInline === false)
    //                 .filter(att => att['@odata.type'] === '#microsoft.graph.fileAttachment')
    //                 // .filter((att) => this.urlResolver.doCacheUrl(att))
    //                 .filter(att => !data.item.attachmentUrls || !this.urlResolver.isCacheValid(data.item.attachmentUrls[att.id]));

    //             if (fileAtt.length) {
    //                 return from(fileAtt.map(att =>
    //                     this.urlResolver.deriveAttachmentUrl(data.item.data.id, att).pipe(
    //                   map((urlCache) => new Item.CacheAttachmentUrlSuccess({ item: data.item, attachemnt: att, urlCache: urlCache })),
    //                         catchError(() => empty()))
    //                 ));
    //             }
    //         }
    //         return empty();
    //     }),
    //     mergeAll(1));

    protected _getOutlookJournalStatus$ = this.actions$.pipe(ofType<Item.GetOutlookJournalStatus>(Item.GET_OUTLOOK_JOURNAL_STATUS),
        delayWhen(action => timer(action.payload.requiredDelay ? 20000 : 0)),
        mergeMap((action) =>
            this.mailItemService.getOutlookJournalStatus(action.payload.internetMessageIds).pipe(
                map(response => new Item.GetOutlookJournalStatusSuccess(response)),
                catchError(error => of(new Item.GetOutlookJournalStatusFail(action.payload, error))))
        ));

    protected _downloadAttachment$ = this.actions$.pipe(ofType<Item.DownloadAttachment>(Item.DOWNLOAD_ATTACHMENT),
        filter(action => action.payload.type === 'computer'),
        mergeMap((action) => {
            return this.urlResolver.getAttachementDownloadUrl(action.payload.owner, action.payload.itemId, action.payload.attachmentId,
                action.payload.attachment, action.payload.isEmail)
                .pipe(map((url) =>
                    ({
                        url: url, name: action.payload.attachment.name,
                        contentType: action.payload.attachment.contentType, isEmail: action.payload.isEmail
                    })));
        }),
        tap(({ url, name, contentType, isEmail }) => {
            if (isEmail) {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', url, true);
                xhr.responseType = 'blob';
                xhr.onload = () => {
                    const downloadLink = document.createElement('a');
                    const file = new Blob([xhr.response], { type: contentType });
                    downloadLink.href = window.URL.createObjectURL(file);
                    downloadLink.download = name;
                    downloadLink.click();
                    downloadLink.remove();
                };
                xhr.send();
            } else {
                window.open(url, '_blank');
            }

        }));
    protected _downloadAttachmentToCloud$ = this.actions$.pipe(ofType<Item.DownloadAttachment>(Item.DOWNLOAD_ATTACHMENT),
        filter(action => action.payload.type === 'cloud'),
        switchMap(action => this.store.select(getUser).pipe(take(1), map(user => ({ user, action })))),
        switchMap(({ user, action }) => {
            const snackBar = this.snackBar.open('Downloading to personal folder', null, {
                verticalPosition: 'top',
                horizontalPosition: 'right'
            });
            return this.mailItemService.downloadMailAttachmentToOneDrive(action.payload.attachment.id, user.profile.upn.split('@')[0]).pipe(
                tap((result) => {
                    snackBar.dismiss();
                    this.snackBar.open('Download complete', result && result.data && result.data.fileUrl ? 'Open' : null, {
                        duration: 5000,
                        verticalPosition: 'top',
                        horizontalPosition: 'right',
                        panelClass: 'dps-download-complete-snackbar'
                    }).onAction()
                        .subscribe(() => {
                            this.store.dispatch(
                                new OpenByUrl({
                                    url: result.data.fileUrl,
                                    id: result.data.fileId,
                                    spec: { ...centerToWindow(800, 600) },
                                    attachmentName: ''
                                }));
                        });
                }),
                map((result) => new Item.DownloadAttachmentSuccess(null)),
                catchError(error => {
                    snackBar.dismiss();
                    return of(new Item.DownloadAttachmentFail({ error, ids: null }));
                }));
        }));

}
