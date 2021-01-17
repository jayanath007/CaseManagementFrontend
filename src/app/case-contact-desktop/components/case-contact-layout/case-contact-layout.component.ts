
import { map, switchMap } from 'rxjs/operators';
import { CaseContact, ContactItemWrapper } from './../../../case-contact-core/models/interface';
import { DPSFilesToMailAttachmentRequestViewModel } from '../../../layout-desktop/models/interfaces';
import { HttpClient } from '@angular/common/http';
import { PageEvent } from '@angular/material';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatterInfo } from '../../../core/lib/matter';
import { ViewChangeKind } from '../../../case-contact-core/actions/core';
import { Recipient, Message } from '../../../core/lib/microsoft-graph';
import { UrlPopupService } from '../../../shell-desktop/services/url-popup.service';
import { Observable } from 'rxjs';
import { MsgraphClientBase, ApiClientWrapper } from '../../../core';
import { AuthInfoStateService, User } from '../../../auth';
import { ServiceEndpointConfig } from '../../../core/configs/service-configs';
import { SemaphoresService } from '../../../shared';

@Component({
  selector: 'dps-case-contact-layout',
  templateUrl: './case-contact-layout.component.html',
  styleUrls: ['./case-contact-layout.component.scss']
})
export class CaseContactLayoutComponent {

  constructor(private authInfo: AuthInfoStateService, private httpClient: HttpClient,
    private configs: ServiceEndpointConfig, private urlPopupService: UrlPopupService, private semaphoresService: SemaphoresService) {
  }
  @Input() fontSizeClass: string;
  @Input() matterInfo: MatterInfo;
  @Input() token: string;
  @Input() caseContactData: any;
  @Input() pageInfo: any;
  @Input() columnDef: any;
  @Input() contactMode: any;

  @Output() rowChange = new EventEmitter();
  @Output() viewChange = new EventEmitter();
  @Output() openMailPopup = new EventEmitter();
  @Output() selectRow = new EventEmitter<any>();
  @Output() selectRowForSearch = new EventEmitter<ContactItemWrapper>();

  pageSizeOptions = [25, 50, 100];

  private msGraphClient: MsgraphClientBase = null;

  public getAuthClient<T>(): Observable<ApiClientWrapper<T>> {
    if (!this.msGraphClient) {
      this.msGraphClient = new MsgraphClientBase(this.authInfo, this.httpClient, this.configs.getGraphApiConfig());
    }
    return this.msGraphClient.getBetaApiClient(this.semaphoresService.getMsgraphBetaSemaphore());
  }
  onExpand(event) {
    this.rowChange.emit(event);
  }
  onViewChange(event) {
    this.viewChange.emit(event);
  }

  onPageChange(pageEvent: PageEvent) {
    this.viewChange.emit({ kind: ViewChangeKind.PageEvent, value: pageEvent });
  }

  onRquestComposeMail(emailAddress: string): void {
    if (this.matterInfo) {
      const toRecipients: string[] = [];
      toRecipients.push(emailAddress);
      const request: DPSFilesToMailAttachmentRequestViewModel = {
        dpsFileCredentials: [],
        htmlBody: '',
        asPDF: false,
        matterRef: this.matterInfo.MatterReferenceNo,
        toRecipients: toRecipients,
        appID: this.matterInfo.AppId,
        branchID: this.matterInfo.BranchId,
        fileID: this.matterInfo.FileId
      };
      this.openMailPopup.emit(request);
    } else {
      const toRecipients: Recipient[] = [{ emailAddress: { address: emailAddress } }];
      const message: Partial<Message> = {
        hasAttachments: false,
        subject: '',
        body: {
          content: '<p></p>',
          contentType: 'html'
        },
        toRecipients: toRecipients,
      };
      this.getAuthClient().pipe(switchMap(client =>
        client.api(`/me/messages`).post(message ? message : {}).pipe(map((result: any) => result))))
        .subscribe(data => {
          const encodeId = encodeURIComponent(data.id);
          const urlPath = `/mail-item/${encodeURIComponent(btoa('me'))}/` + encodeId;
          this.urlPopupService.openWithUrlPoup(urlPath, data.id, false, false);
        });
    }
  }

  onRowClick(data: { row: CaseContact, isDblClick: boolean }) {
    this.selectRow.emit(data);
  }

  onSelectRowForSearch(data: ContactItemWrapper) {
    this.selectRowForSearch.emit(data);
  }

}

