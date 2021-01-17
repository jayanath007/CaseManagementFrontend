
import { filter, retry, map, switchMap, take } from 'rxjs/operators';
import { Pipe, PipeTransform } from '@angular/core';
import { AuthInfoStateService, getUser } from '../../auth';
import { AppConfig } from '../../core';
import { Store } from '@ngrx/store';

@Pipe({
  name: 'dpsUserImage',
  pure: true
})

export class DpsUserImagePipe implements PipeTransform {
  constructor(private store: Store<any>, private authHelper: AuthInfoStateService, private appConfig: AppConfig) {
  }
  transform(value: string, args?: any): any {
    return this.authHelper.getGraphApiToken().pipe(
      retry(3),
      filter((newToken: string) => !!newToken),
      switchMap((newToken) =>
        this.store.select(getUser).pipe(
          filter(user => !!(user.profile && user.profile.upn)),
          take(1),
          map(user => ({ domain: user.profile.upn.replace(/.*@/, '').toLowerCase(), newToken }))
        )
      ),
      map(({ newToken, domain }) => {
        if (!value || ((!args || args === 'users') && value.replace(/.*@/, '').toLowerCase() !== domain)) {
          return '';
        }
        return `${this.appConfig.profilePhotoBase}/v1.0/${args || 'users'}/${value}/photos('64x64')/$value?access_token=${newToken}`;
      }));
    // let token$ = null;
    // let newToken = null;
    // let number = 1;
    // token$ = this.authHelper.acquireDpsWebServiceToken();
    // combineLatest(token$, (token) => ({
    //   token: token
    // })).pipe(filter((_newToken) => !!_newToken),
    //   take(1))
    //   .subscribe((info: any) => {
    //     newToken = info.token;
    //   }).unsubscribe();

    // if (args !== undefined && args === true) {
    //   number = Math.random();
    // }
    // return window.location.origin
    //   + `${this.appConfig.serviceBase}/Graph/GetUserPhoto?idOrUpn=${value}&size=64X64&access_token=${newToken}&updateUrl=`
    //   + number;
    // return `${this.appConfig.serviceBase}/Graph/GetUserPhoto?idOrUpn=${value}&size=64X64&access_token=${newToken}` +
    //   `&dps_selected_database=${this.authHelper.getSelectedDatabase()}&updateUrl=` + number;
  }
}
