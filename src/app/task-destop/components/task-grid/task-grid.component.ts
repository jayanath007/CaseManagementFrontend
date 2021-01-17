import { DataSource } from '@angular/cdk/collections';

import { FileItemWrapper } from '../../../task-core/models/interface';
import { BehaviorSubject ,  Observable } from 'rxjs';

import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material';


@Component({
  selector: 'dps-task-grid',
  templateUrl: './task-grid.component.html',
  styleUrls: ['./task-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskGridComponent implements OnInit, OnChanges {

  // tslint:disable-next-line:max-line-length
  documentUrl = 'https://officeonline.dpscloud.com/wv/wordviewerframe.aspx?WOPISrc=http%3a%2f%2f172.25.200.133%3a8080%2fapi%2fwopi%2ffiles%2f144.DOCX&access_token=!mz%2fZj%2b38cl4%3d9U6VmA%2b%2fs5Nhnfk33igXDhS2420hdI87V8MMs2CwBIM%3d!1dFNGVYtTHds5Jw2FcJpXjCGrSomy8nwki38uRyANfdcPslQYOho6DNWRdmE68KePBtEy92hmF1X%2fwYLAFPM6MFqMmtoHqE4DGTmLEoIbPfgdCJNqa%2b0LY0GYCHx9kjJuoPsnLzD57uweICCSbKSAevMzfnF8MxPxreXQ0qz9bTeVvYKYVJM8bKrTzmtOE2%2fpop8RwflsX26kKcYZd3UWVpUWJl7T1UpFVVrrK5A9qqnCf4WZ4hIEQ6Xge8FkGeYtCnj%2bSgWR8%2b4Oej3HZmpuoIpFOnXt3lWFZ2wDsIe%2fa8PeTWQlIj18hPPbHat%2fRVGmlOQqYl4RfCXwaQWlZEUiVVr0JAC1txHLshr6YVA0kb8WG9K4ikjiJCdPB8y42H98KG2ZM1%2fshs64EvCf7rL030A8dusUlwXldklRkZoz8tf5Po4GIWFmfkPGLoJfUY6EwThq3itxliNUK4C5xpU0kEy9UQa7Dr%2bRo%2f8hAG9WoSlqUdlBRDEamSlB4Jlh8hbudsGHSR0XwJtBjYlWIHw%2fFiYwhxNR%2bFakxiMPYw4Qze0L%2fPTXHcYPBxSfro8z34RxzzrykZVq8irIryun83UT2ut7ojjaNGfHSrOiFtaNhvLNZSOSitgq0PhLhKRceH7';
  displayedColumns = ['isExpand', 'Letter_name'];
  dataSource: any;
  pageSizeOptions = [10, 50, 100];


  @Input() TaskData;
  @Input() PageInfo;
  @Output() IsExpandSelection = new EventEmitter<FileItemWrapper>();
  @Output() PageEvent = new EventEmitter<PageEvent>();

  IsExpand(item: FileItemWrapper) {
    this.IsExpandSelection.emit(item);
  }
  PageChange(pageEvent: PageEvent) {
    this.PageEvent.emit(pageEvent);
  }
  constructor() {

  }
  ngOnInit(): void {
  }
  ngOnChanges(changes: any) {

  }

}









