
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../../core/index';
import { getMimeByFileName } from '../../utils/mime-type';



@Injectable()
export class BlobExplorerService {

  constructor(private http: HttpClient, private appConfig: AppConfig) { }


  public getExplorerTree(prefix = '') {
    return this.http.get<any>(this.appConfig.serviceBase
      + '/File/DoSafeBoxFunction/mycontainer?restype=container&comp=list&prefix=' + prefix + '&delimiter=/').pipe(map((response) => {
        return response;
      }));
  }

  public getBlob(path: string) {

    let header = new HttpHeaders('dps-custom_Content-Encoding');
    header = header.append('dps-custom_Content-Encoding', 'base64');

    return this.http.get<any>(this.appConfig.serviceBase
      + `/File/DoSafeBoxFunction/mycontainer/${path}`).pipe(map((response) => {
        // const url = 'data:application/' + mime.contentType(path) + ';base64,' + response;
        return response;

      }));
  }

  public uploadFile(file, path: string) {
    const data = new FormData();
    data.append('file', file);
    let header = new HttpHeaders();
    // const mime = require('mime-types');
    header = header.append('dps-custom-Content-Type', getMimeByFileName(file.name));
    header = header.append('dps-custom-x-ms-blob-type', 'BlockBlob');
    return this.http.put<any>(this.appConfig.serviceBase
      + '/File/DoSafeBoxFunction/mycontainer' + '/' + path + file.name, file,
      { headers: header }).pipe(
        map((response) => {
          return response;
        }));
  }

  public copyBlob(path: string, newPath: string) {
    const header = new HttpHeaders({ 'dps-custom-x-ms-copy-source': `mycontainer/` + path, });
    return this.http.put<any>(`${this.appConfig.serviceBase}/File/DoSafeBoxFunction/mycontainer/${newPath}`,
      null, { headers: header }).pipe(map((response) => {
        return 'success';
      }));
  }

  public deleteBlob(path: string) {
    return this.http.delete<any>(this.appConfig.serviceBase
      + '/File/DoSafeBoxFunction/mycontainer/' + path).pipe(map((response) => {
        return response;
      }));
  }

  public createContainer() {
    return this.http.get<any>(this.appConfig.serviceBase
      + '/File/CreateSafeBoxContainer').pipe(map((response) => {
        return response;
      }));
  }


}
