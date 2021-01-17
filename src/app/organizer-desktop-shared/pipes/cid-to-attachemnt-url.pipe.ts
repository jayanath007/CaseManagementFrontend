import { Pipe, PipeTransform } from '@angular/core';
import { from as fromPromise, Observable } from 'rxjs';
import { Message, Event } from '../../core/lib/microsoft-graph';
import { BodyHandlerService } from '../services/body-handler.service';

@Pipe({
  name: 'cidToAttachemntUrl'
})
export class CidToAttachemntUrlPipe implements PipeTransform {

  constructor(private bodyHandler: BodyHandlerService) { }

  transform(owner: string, body: any, message: Message | Event, type: string): Observable<string> {
    return fromPromise(this.bodyHandler.substituteInlineAttachementPath(owner, body, message.attachments, message.id, type));
  }

}
