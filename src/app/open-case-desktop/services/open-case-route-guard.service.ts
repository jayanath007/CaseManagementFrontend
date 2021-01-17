
import { take, switchMap, tap, map, filter, pairwise, startWith } from 'rxjs/operators';
import { MainMenuItem } from '../../layout-desktop/models/interfaces';
import { InforDialogComponent } from '../../shared/components/infor-dialog/infor-dialog.component';
import {
  ConfirmDialogData, ConfirmDialogResult, ConfirmDialogResultKind, InforDialogData,
  InforDialogResult
} from '../../shared/models/dialog';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';
import { of, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Injectable, } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { getOpenCaseValidateInforByToken, getOpenCaseMenuData } from '../../open-case-core/reducers';
import { CheckOpenCaseAccess, } from '../../open-case-core/actions/core';
import { MainMenuService } from '../../layout-desktop';
import { OpenCaseMenueData } from '../../core/lib/open-case';
import { OpenCaseService } from '../../open-case-core/services/open-case.service';
import { RemoveFromMainMenu } from '../../layout-desktop/actions/main-menu';


@Injectable()
export class OpenCaseRouteGuardService implements CanActivate {
  // isOpenCaseAccess$;
  // dialogRef: MatDialogRef<ConfirmDialogComponent>;

  constructor(private dialog: MatDialog, private store: Store<any>, private layoutMenu: MainMenuService,
    private openCaseService: OpenCaseService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const token = route.params.token;
    return this.layoutMenu.resolveItemByToken<OpenCaseMenueData>(token).pipe(
      filter((menuItem) => !!menuItem),
      tap((menuItem) => {
        this.store.dispatch(new CheckOpenCaseAccess(token, menuItem.data));
      }), switchMap((menuItem) => {
        return this.store.select(getOpenCaseValidateInforByToken(token)).pipe(
          filter((data) => {
            return data.validateResponce !== undefined;
          }),
          take(1), map((data) => ({ data, menuItem })));
      }),
      switchMap(({ data, menuItem }) => {
        return this.store.select(getOpenCaseMenuData(token)).pipe(map((menuData) => {
          const newMenuItem: Partial<MainMenuItem<OpenCaseMenueData>> = {
            data: menuData,
          };
          return newMenuItem;
        }), take(1), map((newMenuItem) => ({ data, menuItem, newMenuItem })));
      }),
      switchMap(({ data, menuItem, newMenuItem }) => {
        if (menuItem.hidden === false) {
          return of({ result: true, menuItem, newMenuItem });
        } else if (data.validateResponce && data.validateResponce.status === 'Success') {
          if (data.validateResponce.data.length !== 0) {
            const dialogData: ConfirmDialogData = {
              content: {
                title: data.validateResponce.data ? data.validateResponce.data[0].title : '',
                message: data.validateResponce.data ? data.validateResponce.data[0].message : ''
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
            const self = this;
            return dialogRef.afterClosed().pipe(
              map<ConfirmDialogResult, boolean>(dialogResult => {
                if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
                  return true;
                } else {
                  this.store.dispatch(new RemoveFromMainMenu({ id: menuItem.id }));
                  return false;
                }
              }),
              map((result) => ({ result, menuItem, newMenuItem })));
          } else {
            return of({ result: true, menuItem, newMenuItem });
          }
        } else if (data.validateResponce && data.validateResponce.status === 'Fail') {
          const dialogData: InforDialogData = {
            content: {
              title: data.validateResponce.messageHeader,
              message: data.validateResponce.messageBody
            },
            data: { messageType: 'warning' }
          };
          const dialogRef = this.dialog.open(InforDialogComponent, {
            data: dialogData,
            width: '400px',
            disableClose: true,
            panelClass: 'dps-notification'
          });
          return dialogRef.afterClosed().pipe(map<InforDialogResult, boolean>(dialogResult => {
            return false;
          }), map(result => ({ result, menuItem, newMenuItem })));
        } else {
          this.store.dispatch(new RemoveFromMainMenu({ id: menuItem.id }));
          return of({ result: false, menuItem, newMenuItem });
        }
      }),
      tap(({ result, menuItem, newMenuItem }) => {
        if (result) {

          newMenuItem.hidden = false;
          if (!menuItem || menuItem.hidden === true) {
            const menuItemMatterData = newMenuItem.data.matterData.data;
            this.openCaseService.updateMatterHistoryOnOpeningCase
              ({
                AppId: menuItemMatterData.appID,
                BranchId: menuItemMatterData.branchID,
                FileId: menuItemMatterData.fileID
              }).pipe(take(1)).subscribe(() => { });
          }
        }
      }),
      startWith(null),
      pairwise(),
      map((data) => {
        const item = (data[1]) ? data[1] : data[0];
        if (!data[0] || JSON.stringify(data[0].newMenuItem) !== JSON.stringify(data[1].newMenuItem)) {
          setTimeout(() => {
            this.layoutMenu.updateMenuItem(token, item.newMenuItem);
          }, 1);
        }
        return item.result;
      })
    );
  }

}
