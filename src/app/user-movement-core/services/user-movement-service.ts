import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, DropdownListData, MsgraphClientBase, ApiClientWrapper } from '../../core';
import { map, switchMap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { ServiceEndpointConfig } from '../../core/configs/service-configs';
import { AuthInfoStateService } from '../../auth';
import { Observable } from 'rxjs';
import { ScheduleInformation } from '../../core/lib/microsoft-graph';
import { SemaphoresService } from '../../shared';

@Injectable()
export class UserMovementService {

  private msGraphClient: MsgraphClientBase = null;

  constructor(private httpClient: HttpClient, private appConfig: AppConfig, private datePipe: DatePipe,
    private configs: ServiceEndpointConfig, private authInfo: AuthInfoStateService, private semaphoresService: SemaphoresService) {
  }

  private getOrCreateClient() {
    if (!this.msGraphClient) {
      this.msGraphClient = new MsgraphClientBase(this.authInfo, this.httpClient, this.configs.getGraphApiConfig());
    }
    return this.msGraphClient;
  }
  private getAuthClient<T>(): Observable<ApiClientWrapper<T>> {
    return this.getOrCreateClient().getAuthClient(this.semaphoresService.getMsgraphSemaphoree());
  }
  private getBetaApiClient<T>(): Observable<ApiClientWrapper<T>> {
    return this.getOrCreateClient().getBetaApiClient(this.semaphoresService.getMsgraphBetaSemaphore());
  }

  public getCurrentDateUserMovement(userList: any, location: string, isOffToday: boolean) {
    const userIds = userList ? userList.map(x => x.user) : null;
    if (userIds && userIds.length > 0) {
      return this.httpClient.post<any>(this.appConfig.serviceBase + '/ActivityTraker/GetCurrentDateUserMovements', {
        userIds: userIds,
        teamFilterOptionViewModel:
        {
          locationSearch: location,
          isOffToday: isOffToday
        }

      });
    }
  }
  public GetNextAvailableUserMovementTypes(userId: string) {
    if (userId) {
      return this.httpClient.get<any>(this.appConfig.serviceBase
        + '/ActivityTraker/GetNextAvailableUserMovementTypes?userId=' + userId).pipe(map(response => response.data));
    }
  }
  public getDepartmentList(): Observable<DropdownListData[]> {
    return this.httpClient.get<any>(this.appConfig.serviceBase + '/Team/GetDepartments').pipe(
      map(response => response.data));
  }
  public AddUserMovement(saveDate) {
    return this.httpClient.post<any>(`${this.appConfig.serviceBase}/ActivityTraker/AddUserMovement`,
      {
        fromDate: this.datePipe.transform(saveDate.fromDate, 'yyyy-MM-dd HH:mm:ss'),
        notes: saveDate.notes,
        toDate: this.datePipe.transform(saveDate.toDate, 'yyyy-MM-dd HH:mm:ss'),
        userId: saveDate.userId,
        userMovementTypeId: saveDate.userMovementTypeId,
        location: saveDate.location,
      }
    );
  }
  public getTeamUsers(param) {
    return this.httpClient.post<any>(this.appConfig.serviceBase + '/Dashboard/GetEmployeesList', {
      'DataSourceRequestViewModel': {
        'take': 0,
        'skip': 0
      },
      'EmployeeFilterOptionViewModel': {
        'User': param.user,
        'DepartmentId': param.departmentId,
        'UserNameSearch': param.membereSearchText,
        'IsInactiveFeeearners': param.isInactiveFeeEarners
      }
    }).pipe(map(response => response.data));
  }



  public getMovementLocation(): Observable<any> {
    return this.httpClient.get<any>(this.appConfig.serviceBase + '/ActivityTraker/GetLocations').pipe(
      map(response => response.data));
  }

  public getSchedule(schedules: string[], start: string, end: string, viewInterval?: number): Observable<ScheduleInformation[]> {
    const headers = {};
    headers['Prefer'] = `outlook.timezone="UTC"`;
    return this.getAuthClient().pipe(switchMap(client =>
      client.api(`me/calendar/getSchedule`)
        .post({
          schedules,
          startTime: {
            dateTime: start,
            timeZone: 'UTC'
          },
          endTime: {
            dateTime: end,
            timeZone: 'UTC'
          },
          availabilityViewInterval: viewInterval || 30
        }, headers).pipe(map((result: any) => {
          return result.value || [];
        }))
    ));
  }

  // public getDepartmentList(): Observable<DropdownListData[]> {
  //   return this.httpClient.get<any>(this.appConfig.serviceBase + '/Team/GetDepartments').pipe(
  //     map(response => response.data));
  // }

  // public createLinkedMatter(request: PlotMatterViewModel) {

  //   return this.httpClient.post<any>(this.appConfig.serviceBase + '/Matters/AddPlotMatters', request.toPost());
  // }

  // public addDiaryRecordsForPlot(request: any) {
  //   return this.httpClient.post<any>(this.appConfig.serviceBase + '/Diary/AddDiaryRecordsForPlotMattters', request.toPost());
  // }

  // public savePlotSaleScreenData(request: PlotSaleScreenDataViewModel) {
  //   return this.httpClient.post<any>(`${this.appConfig.serviceBase}/WorkFlow/SavePlotSaleScreenData`, request);
  // }

  // public updatePlotMatters(request: PlotMatterUpdateViewModel) {
  //   return this.httpClient.post<any>(this.appConfig.serviceBase + '/Matters/UpdatePlotMatters', request.toPost());
  // }
}

