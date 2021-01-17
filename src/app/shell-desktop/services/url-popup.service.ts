import { Injectable } from '@angular/core';
import { ConfirmDialogData, ConfirmDialogComponent, InforDialogData, InforDialogComponent } from '../../shared';
import { ShellTranslationsService } from './shell-translations.service';
import { MatDialog } from '@angular/material';
import { AppConfig } from './../../core/configs/app-config';

@Injectable()
export class UrlPopupService {

    constructor(private translations: ShellTranslationsService, public dialog: MatDialog, private appConfig: AppConfig, ) { }


    public openWithUrlPoup(urlPath: string, key, completeUrl: boolean,
        fullScreen: boolean, title?: string, requiredReload?: boolean): boolean {

        const url = completeUrl ? urlPath : window.location.origin + urlPath;
        const popupWidth = fullScreen ? screen.width - 100 : 900;
        const popupHeight = fullScreen ? screen.height - 200 : 700;
        const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen['left'];
        const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen['top'];

        const width = window.innerWidth ? window.innerWidth :
            document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        const height = window.innerHeight ? window.innerHeight :
            document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

        const left = ((width / 2) - (popupWidth / 2)) + dualScreenLeft;
        const top = ((height / 2) - (popupHeight / 2)) + dualScreenTop;

        const newWindow = window.open('', key, 'scrollbars=yes, width=' + popupWidth + ', height='
            + popupHeight + ', top=' + top + ', left=' + left);

        if (newWindow.closed || (!newWindow.document.URL) || (requiredReload) ||
            (requiredReload !== false && newWindow.location.href !== url)
            || (newWindow.document.URL.indexOf('about') === 0)) {
            newWindow.location.href = url;
        }


        // Puts focus on the newWindow
        if (window.focus) {
            if (newWindow) {
                newWindow.focus();
            }
        }
        if (title) {
            this.setTitle(newWindow, title);
        }

        if (!(window.navigator.userAgent.indexOf('Edge') > -1)
            && !newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
            return false;
            // this.warningMessage();
        }
        return true;
    }

    setTitle(win: Window, title: string) {
        if (win.document) { // if loaded
            win.document.title = title; // set title
        } else { // if not loaded yet
            setTimeout(this.setTitle, 10); // check in another 10ms
        }
    }

}
