import { Injectable } from '@angular/core';

@Injectable()
export class CalendarTranslationsService {
  group_delete_confirm_title = 'Delete calendar';
  group_delete_confirm_message = `Are you sure you want to permanently delete the calendar?`;
  file_attachment_size_validation_title = `Attachment size get exceeded.`;
  file_attachment_size_validation_message = `Size of document "<%= displayName %>" is <%= displaySize %>MB.
  Please attach a document less than 35MB.`;
  constructor() { }
}
