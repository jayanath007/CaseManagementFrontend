
import { switchMap, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { Calendar } from '../../../core/lib/full-calendar';
import { AppConfig } from '../../../core/configs/app-config';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthInfoStateService } from '../../../auth';
import { ServiceEndpointConfig } from '../../../core/configs/service-configs';
import { MsgraphClientBase } from '../../../core';
import { SemaphoresService } from '../../../shared';


@Component({
  selector: 'dps-calendar-test-events',
  templateUrl: './calendar-test-events.component.html',
  styleUrls: ['./calendar-test-events.component.scss']
})
export class CalendarTestEventsComponent extends MsgraphClientBase implements OnInit {
  calendarList1: any[] = [];
  calendarList2: any[] = [];

  @Output() close = new EventEmitter();

  constructor(authInfo: AuthInfoStateService, httpClient: HttpClient, configs: ServiceEndpointConfig,
    private appConfig: AppConfig, private semaphoresService: SemaphoresService) {
    super(authInfo, httpClient, configs.getGraphApiConfig());

  }

  ngOnInit() {
  }

  public listCalendars1() {
    this.getBetaApiClient<{ value: [Calendar] }>(this.semaphoresService.getMsgraphSemaphoree()).pipe(
      switchMap(client => client.api('/me/calendars')
        .top(999)
        .get().pipe(
          map(result => {
            return result.value;
          }))
      )).subscribe(data => {
        return this.calendarList1 = data;
      });
  }

  public ListCalendars2() {
    return this.httpClient.get<any>(this.appConfig.serviceBase + '/MailBox/GetCalendarfoldersAndGroups').pipe(
      map((response: { data: [any] }) => {
        let calendarList = [];
        if (response.data) {
          response.data.forEach(val => {
            if (val.calendarFolders && val.calendarFolders.length) {
              calendarList = calendarList.concat(val.calendarFolders);
            }
          });
        }
        return calendarList;
      })).subscribe(data => {

        return this.calendarList2 = data;

      });


  }

  onLoadList() {
    this.calendarList1 = null;
    this.calendarList2 = null;
    this.listCalendars1();
    this.ListCalendars2();

  }

  //   onClose() {

  // this.close.emit();
  //   }



}
