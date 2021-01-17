
import { map, switchMap } from 'rxjs/operators';
import { ServiceEndpointConfig } from '../../../core/configs/service-configs';
import { MsgraphClientBase } from '../../../core/lib/msgraph-client-base';
import { timer, Subscription, Observable } from 'rxjs';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UrlPopupService } from '../../../shell-desktop/services/url-popup.service';
import { HttpClient } from '@angular/common/http';
import { AuthInfoStateService } from '../../../auth';
import { ApiClientWrapper } from '../../../core';
import { Message } from '../../../core/lib/microsoft-graph';
import { ExceptionDialogData, SemaphoresService } from '../../../shared';


@Component({
  selector: 'dps-exception-indicator-item',
  templateUrl: './exception-indicator-item.component.html',
  styleUrls: ['./exception-indicator-item.component.scss']
})
export class ExceptionIndicatorItemComponent implements OnInit {


  @Input() data: ExceptionDialogData;
  @Output() removeException = new EventEmitter<number>();
  @Output() closeException = new EventEmitter<number>();
  @Input() closeIcon;


  mouseOver: boolean;
  colosePopup: Subscription;
  composUrlPopUploding = false;
  private msGraphClient: MsgraphClientBase = null;

  constructor(private authInfo: AuthInfoStateService, public urlPopupService: UrlPopupService,
    private httpClient: HttpClient, private configs: ServiceEndpointConfig, private semaphoresService: SemaphoresService) {
  }
  public getAuthClient<T>(): Observable<ApiClientWrapper<T>> {
    if (!this.msGraphClient) {
      this.msGraphClient = new MsgraphClientBase(this.authInfo, this.httpClient, this.configs.getGraphApiConfig());
    }
    return this.msGraphClient.getAuthClient(this.semaphoresService.getMsgraphSemaphoree());
  }

  ngOnInit() {
    this.colosePopup = timer(10000).subscribe(x => {
      this.closeException.emit(this.data.id);
    });
  }

  sendEmail() {
    const message: Partial<Message> = {
      subject: 'DPS Error code: ' + this.data.content.code.replace('<br>', '   '),
      body: {
        content: this.createMessage() || '<p></p>',
        contentType: 'html'
      },
      toRecipients: [{ emailAddress: { name: '', address: 'TechnicalSupport@dpssoftware.co.uk' } }],
      // bccRecipients: [{ emailAddress: { name: '', address: 'techsupportsl@dpssoftware.co.uk' } } ],
    };
    this.createItem(message)
      .subscribe(data => {
        const encodeId = encodeURIComponent(data.id);
        const urlPath = `/mail-item/${encodeURIComponent(btoa('me'))}/` + encodeId;
        this.urlPopupService.openWithUrlPoup(urlPath, encodeId, false, false);
        this.removeException.emit(this.data.id);
      });
  }

  createItem(message) {
    return this.getAuthClient().pipe(switchMap(client =>
      client.api(`/me/messages`).post(message ? message : {}).pipe(map((result: any) => result))));
  }

  createMessage() {
    let message = '';
    if (this.data.content.path) {
      message = this.data.content.path + '<br><br>';
    }
    message += this.data.content.message + ' ' + this.data.content.code + '<br> Date Time - ' + this.data.content.dateTime + '<br><br>';
    if (this.data.content.isGraphApi && this.data.content.error) {
      message += 'Graph Api Error <br/>RequestId - ' + this.data.content.error.requestId + '<br> Date - ' +
        this.data.content.error.date + '<br>';
    }
    return message;
  }

  onClose(id: number) {
    this.closeException.emit(this.data.id);
  }
  onRemove() {
    this.removeException.emit(this.data.id);
  }
  onMouseOver() {
    this.colosePopup.unsubscribe();
  }

  onMouseLeave() {
    this.colosePopup = timer(5000).subscribe(x => {
      this.closeException.emit(this.data.id);
    });
  }

}

