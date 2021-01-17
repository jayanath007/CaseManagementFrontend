import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BlobFileRequest, AzureSasTokenResponse, StorageKind } from '../models/interfaces';
import { AppConfig } from '../../core';

@Injectable()
export class SasGeneratorService {
  constructor(private http: HttpClient, private appConfig: AppConfig) { }

  getUploadSasToken(fileName: string, url: string, method: 'get' | 'post', body?: any): Observable<BlobFileRequest> {
    if (method === 'post') {
      return this.http.post<any>(url, body).pipe(this.uploadResponseMap(fileName, url));
    }
    return this.http.get<any>(url).pipe(this.uploadResponseMap(fileName, url));
  }

  getUploadSasTokens(fileNames: string[], url: string, method: 'get' | 'post', body?: any): Observable<BlobFileRequest[]> {
    if (method === 'post') {
      return this.http.post<any>(url, body).pipe(this.multiUploadResponseMap(fileNames, url));
    }
    return this.http.get<any>(url).pipe(this.multiUploadResponseMap(fileNames, url));
  }

  private uploadResponseMap = (fileName, url) => map((response: { body: AzureSasTokenResponse }) => ({
    ...response.body,
    storageKind: response.body.storageKind || StorageKind.Files,
    fileName,
    url: `${this.appConfig.apiv3StorageProxy}/StorageProxy/${response.body.storageKind || StorageKind.Files}/`,
    tokenRequestUrl: url,
    id: new Date().valueOf()
  }))

  private multiUploadResponseMap = (fileNames: string[], url) =>
    map((response: { body: AzureSasTokenResponse[] }) => response.body.map((body, index) => ({
      ...body,
      fileName: fileNames[index],
      url: `${this.appConfig.apiv3StorageProxy}/StorageProxy/${body.storageKind}/`,
      tokenRequestUrl: url,
      id: new Date().valueOf()
    })))
}
