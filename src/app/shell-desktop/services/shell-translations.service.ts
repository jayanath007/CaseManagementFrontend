import { Injectable } from '@angular/core';

@Injectable()
export class ShellTranslationsService {
  popup_blocked_title = 'Popup has been blocked';
  popup_blocked_message = `Please allow popup for this domain`;
  constructor() { }
}
