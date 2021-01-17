import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
  InforDialogComponent, InforDialogData, ConfirmDialogResult, ConfirmDialogResultKind,
  ConfirmDialogData, ConfirmDialogComponentWithCancel, ConfirmDialogComponent
} from '../../shared';
import { WindowSpec, IDocumentCheckin } from '../models/interfaces';
import { isMyDomainUrl } from '../../utils/file';
import { map } from 'rxjs/operators';
import { harmfullFileForView } from '../../core';

@Injectable()
export class WindowPopupsManagerService {

  popups = new Map<string, Window>();

  constructor(private dialog: MatDialog) { }

  openWopiHostPage(id: string, wopiUrl: string, accessToken: string, ttl: string) {
    const params = {};
  }

  openWindow(id: string, url: string, spec: WindowSpec, fileExtention: string) {
    let popup = this.popups.get(id);
    try {

      if (!popup || popup.closed || popup.location.href !== url) {
        popup = this.tryOpenWindow(id, url, this.toSpecStr(spec), fileExtention);
      }
    } catch (e) {
      console.error(e);
    }
    if (popup) {
      this.popups.set(id, popup);
      popup.focus();
    }
    return !!popup;
  }

  public openCheckinWindow(checkin: IDocumentCheckin, spec: WindowSpec) {
    const id = checkin.hashKey;
    if (this.openWindow(id || '', checkin.url, spec, '') && id) {
      const popup = this.popups.get(id);
      this.handlePopupClose(popup, () => {
        // this.showCheckinConfirmDialog(() => {
        //   checkin.checkin().subscribe((data) => {
        //     console.log('document cheking done', data);
        //   });
        // });
      });
    }
  }

  private handlePopupClose(popup, callback) {
    const timer = setInterval(() => {
      if (popup.closed) {
        clearInterval(timer);
        callback();
      }
    }, 1000);
  }

  private toSpecStr(spec: WindowSpec) {
    return Object.keys(spec).map((key) => {
      if (spec[key] === true) {
        return key;
      } else if (!spec[key]) {
        return `${key}=no`;
      } else {
        return `${key}=${spec[key]}`;
      }
    }).join(',');
  }

  private tryOpenWindow(id: string, url: string, spec: string, fileExtention: string) {
    let popup = null;


    try {
      if (url && !isMyDomainUrl(url) || !harmfullFileForView.includes(fileExtention)) {
        // if ((url && url.includes('assets/wopi-host.html')) || !harmfullFileForView.includes(fileExtention)) {
        popup = window.open(url, id, spec);
      } else {
        popup = window.open('', id, spec);
        const doc = popup.document;
        doc.write(`<HTML><HEAD><TITLE>DPS Document View</TITLE></HEAD><BODY><iframe width=100% height=100% frameborder=0 sandbox src=${url}>
        </iframe ></BODY></HTML>`);
      }

    } catch (e) {
      console.error(e);
    }

    if (!popup) {
      const dialogData: InforDialogData = {
        content: {
          title: 'Popup disabled',
          message: 'Please allow popup window from your browser'
        },
        contentParams: {},
        data: { messageType: 'alert' }
      };

      const dialogRef = this.dialog.open(InforDialogComponent, {
        data: dialogData,
        width: '350px',
        panelClass: 'dps-notification'
      });
    }
    return popup;
  }

  showUnsupportedFileMessage(fileName) {
    const dialogData: InforDialogData = {
      content: {
        title: 'Unsupported file',
        message: `Browser dosen't support opening the file type for ${fileName}`
      },
      data: { messageType: 'general' }
    };

    const ref = this.dialog.open(InforDialogComponent, {
      data: dialogData,
      width: '400px',
      disableClose: true,
      hasBackdrop: true,
      panelClass: 'dps-notification'
    });

    return ref.afterClosed();
  }

  showtempalteCreateDialog() {
    const dialogData: ConfirmDialogData = {
      content: {
        title: 'Template not exists',
        message: 'Do you need to create the template',
      },
      contentParams: {},
      data: null
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
      width: '400px',
      disableClose: true,
      panelClass: 'dps-notification'
    });
    return dialogRef.afterClosed().pipe(map((dialogResult) => dialogResult.kind === ConfirmDialogResultKind.Confirmed));
  }
}
