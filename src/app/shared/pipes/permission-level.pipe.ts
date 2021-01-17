import { Pipe, PipeTransform } from '@angular/core';
import { PermissionLevel } from '../../mail-core';

@Pipe({
  name: 'permissionLevel'
})
export class PermissionLevelPipe implements PipeTransform {

  transform(value: PermissionLevel, args?: any): any {
    switch (value) {
      case PermissionLevel.None:
        return 'None';
      case PermissionLevel.Owner:
        return 'Owner';
      case PermissionLevel.PublishingEditor:
        return 'Publishing Editor';
      case PermissionLevel.Editor:
        return 'Editor';
      case PermissionLevel.PublishingAuthor:
        return 'Publishing Author';
      case PermissionLevel.Author:
        return 'Author';
      case PermissionLevel.NoneditingAuthor:
        return 'Nonediting Author';
      case PermissionLevel.Reviewer:
        return 'Reviewer';
      case PermissionLevel.Contributor:
        return 'Contributor';
      case PermissionLevel.Custom:
        return 'Custom';
      default:
        return 'None';
    }
  }

}
