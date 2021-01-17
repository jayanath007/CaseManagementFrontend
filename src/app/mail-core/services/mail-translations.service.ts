import { Injectable } from '@angular/core';

@Injectable()
export class MailTranslationsService {
  folder_delete_confirm_title = 'Delete folder';
  folder_delete_confirm_message = `Are you sure you want to move the folder '<%= displayName %>' and all its contents to Deleted Items?`;
  folder_permanent_delete_confirm_message =
    `Are you sure you want to permanently delete the folder '<%= displayName %>' and all its contents?`;
  constructor() { }
}
