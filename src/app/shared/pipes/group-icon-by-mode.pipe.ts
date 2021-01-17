import { Pipe, PipeTransform } from '@angular/core';
import { GroupMode as MytaskGroupMode } from '../../my-tasks-core/models/interfce';
import { GroupMode as FileHistoryGroupMode } from '../../file-history-core/models/interface';

@Pipe({
  name: 'groupIconByMode',
  pure: true
})
export class GroupIconByModePipe implements PipeTransform {


  fileHistoryGroupMode = FileHistoryGroupMode;
  mytaskGroupMode = MytaskGroupMode;


  transform(value: string, args?: any): any {
    if (value) {
      switch (value) {
        case this.fileHistoryGroupMode.Folder:
          return 'web_asset';
        case (this.fileHistoryGroupMode.Date || this.mytaskGroupMode.Date):
          return 'calendar_today';
        case 'DateGroup':
          return 'calendar_today';
        case this.fileHistoryGroupMode.FolderDate:
          return 'ballot';
        case this.fileHistoryGroupMode.DateFolder:
          return 'event';
        case 'By':
          return 'person';
        case 'DateByUser':
          return 'calendar_today';
        case 'ByUserDate':
          return 'ballot';
        default:
          return 'insert_drive_file';
      }
    }
    return 'Error';
  }
}
