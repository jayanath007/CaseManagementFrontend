import { Injectable } from '@angular/core';

@Injectable()
export class CalendarGroupTranslationsService {
  group_delete_confirm_title = 'Delete calendar group';
  group_delete_confirm_message = `Are you sure you want to permanently delete the calendar group?`;
  constructor() { }
}
