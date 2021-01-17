import { Injectable, Inject } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfig, DPSResponse } from '../../core';
import { FileUrlResolverService } from '../../document-view/services/file-url-resolver.service';
import { WindowPopupsManagerService } from '../../document-view/services/window-popups-manager.service';
import { uuid } from '../../utils/uuid';
import { centerToWindow } from '../../utils/bounds';
import { isMobile } from '../../utils/is-mobile';
import { LinkedMatterRequestViewModel, PlotMatterViewModel, PlotMatterUpdateViewModel } from '../models/request';
import { PlotSaleScreenDataViewModel } from '../models/interfaces';
@Injectable()
export class MatterLinkedService {

  constructor(private httpClient: HttpClient, private appConfig: AppConfig,
    private fileUrlResolverService: FileUrlResolverService, private windowPopupsManagerService: WindowPopupsManagerService) {


  }


  public getLinkedMatter(request: LinkedMatterRequestViewModel) {

    return this.httpClient.post<any>(this.appConfig.serviceBase + '/Matters/GetLinkedMattersForSpecificMatter', request.toPost());
  }


  public createLinkedMatter(request: PlotMatterViewModel) {

    return this.httpClient.post<any>(this.appConfig.serviceBase + '/Matters/AddPlotMatters', request.toPost());
  }


  public getPlotStatus(request: PlotMatterViewModel) {

    return this.httpClient.post<any>(this.appConfig.serviceBase + '/Matters/getPlotStatus', request.toPost());
  }


  public addDiaryRecordsForPlot(request: any) {
    return this.httpClient.post<any>(this.appConfig.serviceBase + '/Diary/AddDiaryRecordsForPlotMattters', request.toPost());
  }

  public savePlotSaleScreenData(request: PlotSaleScreenDataViewModel) {
    return this.httpClient.post<any>(`${this.appConfig.serviceBase}/WorkFlow/SavePlotSaleScreenData`, request);
  }

  public updatePlotMatters(request: PlotMatterUpdateViewModel) {
    return this.httpClient.post<any>(this.appConfig.serviceBase + '/Matters/UpdatePlotMatters', request.toPost());
  }



}

