
import { map, filter, retry } from 'rxjs/operators';
import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthInfoStateService, User } from '../../auth';
import { AppConfig } from '../../core';

@Pipe({
  name: 'dpsLoginUserImage',
  pure: true
})
export class DpsLoginUserImagePipe implements PipeTransform {
  constructor(protected store: Store<any>, private authHelper: AuthInfoStateService, private appConfig: AppConfig) {
  }
  transform(value: User, args?: any): any {
    return this.authHelper.getGraphApiToken().pipe(
      retry(3),
      filter((newToken) => !!newToken),
      map((newToken) =>
        `${this.appConfig.profilePhotoBase}/v1.0/me/${args ? `photos('${args}')` : 'photo'}/$value?updateUrl=${
        value.userImageUid}&access_token=${newToken}`));
    // tslint:disable-next-line:max-line-length
    // map((newToken) => `${this.appConfig.serviceBase}Graph/GetUserPhoto?idOrUpn=${value.userName}&size=64X64&access_token=${newToken}&updateUrl=${value.isLoadingUserImage}&dps_selected_database=${this.authHelper.getSelectedDatabase()}`));
  }
}
