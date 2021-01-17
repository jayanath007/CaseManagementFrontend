
import { map, take, filter } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MainMenuService } from './main-menu.service';
import { OpenCaseMenueData } from '../../core/lib/open-case';
import { getMenuItemDisplayName } from '../reducers';


@Injectable({
  providedIn: 'root'
})
export class MainMenuItemResolverService {

  constructor(private store: Store<any>, private menuService: MainMenuService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {

    return this.menuService.resolveItemByToken<OpenCaseMenueData>(route.params.token).pipe(
      filter((item) => item.hidden !== true),
      take(1), map((menuItem) => {
        return menuItem.data;
      }
      ));
  }

  public getModuleDisplayName(menuItemId: string): Observable<string> {
    return this.store.select(getMenuItemDisplayName(menuItemId));
  }

}
