import { Inject, Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TransferProgressEvent } from '@azure/core-http';
import { PagedAsyncIterableIterator } from '@azure/core-paging';
import { BlockBlobClient, BlobDownloadResponseModel, RestError } from '@azure/storage-blob';
import { FileURL, uploadBrowserDataToAzureFile } from '@azure/storage-file';
import { from, Observable, Subscriber, OperatorFunction, throwError, of, forkJoin } from 'rxjs';
import { distinctUntilChanged, scan, startWith, map, switchMap, tap, catchError, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import {
  BlobFileRequest, AzureStorageClientFactory, ItemUpload, StorageKind, EmailItem, DriveItem, DiaryItem, InboxItem
} from '../models/interfaces';
import { AZURE_STORAGE_TOKEN } from './tokens';
import { SasGeneratorService } from './sas-generator.service';
import { UpdateItemUploadProgress, ItemUploadFail } from '../actions/azure';
import { AuthInfoStateService, getUser } from '../../auth';
import { AzureHttpClientService } from './azure-http-client.service';

@Injectable()
export class AzureStorageService {
  constructor(
    @Inject(AZURE_STORAGE_TOKEN) private getAzureClient: AzureStorageClientFactory,
    private authHelper: AuthInfoStateService,
    private sasGenerator: SasGeneratorService,
    private sanitizer: DomSanitizer,
    private store: Store<any>,
    private azureHttpService: AzureHttpClientService
  ) { }



  public requestSasTokenWithStorage(url: string, method: 'get' | 'post', body?: any) {
    const uploadLocalFile = (file: File) => {
      return this.getStorageOptionsForUpload(file.name, url, method, body).pipe(
        switchMap(options =>
          this.uploadToAzureStorage(file, options)
            .pipe(
              this.mapUploadResponse(file, options),
              catchError(error => {
                this.store.dispatch(new ItemUploadFail(error, options));
                return throwError(error);
              })
            )
        )
      );
    };
    const uploadLocalFiles = (files: File[]) => {
      return this.getStorageOptionsForMultiUpload(files.map(file => file.name), url, method, body).pipe(
        switchMap(optionsList =>
          forkJoin(optionsList.map((options, index) => this.uploadToAzureStorage(files[index], options)
            .pipe(
              this.mapUploadResponse(files[index], options),
              catchError(error => {
                this.store.dispatch(new ItemUploadFail(error, options));
                return throwError(error);
              })
            )))
        )
      );
    };
    const uploadEmailsAsMsg = (items: EmailItem[], audiance: string, isGoogle?: boolean) => {
      return this.getStorageOptionsForMultiUpload(items.map(item => item.subject + '.msg'), url, method, body).pipe(
        tap(optionsList => {
          optionsList.forEach(options => {
            this.store.dispatch(new UpdateItemUploadProgress({ ...options, progress: 0, uploading: true }));
          });
        }),
        switchMap(optionsList => this.store.select(getUser).pipe(take(1), map(user => ({ optionsList, user })))),
        switchMap(({ optionsList, user }) =>
          this.azureHttpService.uploadEmailsAsMsg(
            items.map((item, i) => ({
              itemId: item.itemId,
              messageId: item.messageId,
              userEmail: (!item.userEmail || item.userEmail === 'me') ? user.profile.upn : item.userEmail,
              token: optionsList[i].token
            })),
            audiance,
            isGoogle
          ).pipe(
            map(({ response, status }) => optionsList.map<ItemUpload>((options, i) =>
              ({ ...options, progress: 100, uploading: false, token: response.itemAccess[i].token })
            )),
            tap(itemsUpload => {
              itemsUpload.forEach(item => {
                this.store.dispatch(new UpdateItemUploadProgress(item));
              });
            }),
            catchError(error => {
              optionsList.forEach(options => {
                this.store.dispatch(new ItemUploadFail(error, options));
              });
              return throwError(error);
            })
          )
        )
      );
    };

    const uploadDriveItems = (items: DriveItem[], driveId: string, audiance: string) => {
      return this.getStorageOptionsForMultiUpload(items.map(item => item.name), url, method, body).pipe(
        tap(optionsList => {
          optionsList.forEach(options => {
            this.store.dispatch(new UpdateItemUploadProgress({ ...options, progress: 0, uploading: true }));
          });
        }),
        switchMap(optionsList =>
          this.azureHttpService.uploadDriveItems(
            items.map((item, i) => ({ itemRef: item.itemRef, token: optionsList[i].token })),
            driveId, audiance
          ).pipe(
            map(result => optionsList.map<ItemUpload>(options => ({ ...options, progress: 100, uploading: false }))),
            tap(itemsUpload => {
              itemsUpload.forEach(item => {
                this.store.dispatch(new UpdateItemUploadProgress(item));
              });
            }),
            catchError(error => {
              optionsList.forEach(options => {
                this.store.dispatch(new ItemUploadFail(error, options));
              });
              return throwError(error);
            })
          )
        )
      );
    };
    const uploadDiaryItems = (items: DiaryItem[], appCode: string, branchId: number, fileId: number) => {
      return this.getStorageOptionsForMultiUpload(items.map(item => item.name), url, method, body).pipe(
        tap(optionsList => {
          optionsList.forEach(options => {
            this.store.dispatch(new UpdateItemUploadProgress({ ...options, progress: 0, uploading: true }));
          });
        }),
        switchMap(optionsList =>
          this.azureHttpService.uploadDiaryItems(
            items.map((item, i) => ({ itemRef: item.diaryId || item.name, token: optionsList[i].token })),
            appCode, branchId, fileId
          ).pipe(
            map(result => optionsList.map<ItemUpload>(options => ({ ...options, progress: 100, uploading: false }))),
            tap(itemsUpload => {
              itemsUpload.forEach(item => {
                this.store.dispatch(new UpdateItemUploadProgress(item));
              });
            }),
            catchError(error => {
              optionsList.forEach(options => {
                this.store.dispatch(new ItemUploadFail(error, options));
              });
              return throwError(error);
            })
          )
        )
      );
    };
    const uploadInboxItems = (items: InboxItem[], audiance: string) => {
      return this.getStorageOptionsForMultiUpload(items.map(item => item.name), url, method, body).pipe(
        tap(optionsList => {
          optionsList.forEach(options => {
            this.store.dispatch(new UpdateItemUploadProgress({ ...options, progress: 0, uploading: true }));
          });
        }),
        switchMap(optionsList =>
          this.azureHttpService.uploadInboxItems(
            items.map((item, i) => ({ itemId: item.inboxId, token: optionsList[i].token })), audiance).pipe(
              map(result => optionsList.map<ItemUpload>(options => ({ ...options, progress: 100, uploading: false }))),
              tap(itemsUpload => {
                itemsUpload.forEach(item => {
                  this.store.dispatch(new UpdateItemUploadProgress(item));
                });
              }),
              catchError(error => {
                optionsList.forEach(options => {
                  this.store.dispatch(new ItemUploadFail(error, options));
                });
                return throwError(error);
              })
            )
        )
      );
    };
    return {
      uploadLocalFile,
      uploadLocalFiles,
      uploadEmailsAsMsg,
      uploadDriveItems,
      uploadDiaryItems,
      uploadInboxItems
    };

  }

  // public deleteItem(filename: string, containerName: string) {
  //   return this.getStorageOptionsWithContainer(containerName).pipe(
  //     switchMap(options =>
  //       this.deleteBlobItem({ ...options, filename })
  //         .pipe(this.mapDeleteResponse(filename, options))
  //     )
  //   );
  // }

  // public downloadItem(filename: string, containerName: string) {
  //   return this.getStorageOptionsWithContainer(containerName).pipe(
  //     switchMap(options =>
  //       this.downloadBlobItem({ ...options, filename })
  //         .pipe(this.getDownloadUrlFromResponse())
  //     )
  //   );
  // }

  // public getContainerItems(containerName: string) {
  //   return this.getStorageOptions().pipe(
  //     switchMap(options =>
  //       this.listBlobsInContainer({ ...options, containerName })
  //     )
  //   );
  // }

  // public getContainers() {
  //   return this.getStorageOptions().pipe(
  //     switchMap(options => this.getContainersInBlobStorage(options))
  //   );
  // }

  // private getContainersInBlobStorage(request: BlobStorageRequest) {
  //   const blobServiceClient = this.getBlockBlobClient(request);
  //   return this.asyncToObservable(blobServiceClient.listContainers());
  // }

  // private listBlobsInContainer(request: BlobContainerRequest) {
  //   const containerClient = this.getContainerClient(request);
  //   return this.asyncToObservable(containerClient.listBlobsFlat());
  // }

  // private downloadBlobItem(request: BlobFileRequest) {
  //   const blockBlobClient = this.getAzureClient(request, this.authHelper);
  //   return from(blockBlobClient.download());
  // }

  // private deleteBlobItem(request: BlobFileRequest) {
  //   const blockBlobClient = this.getAzureClient(request, this.authHelper);
  //   return from(blockBlobClient.delete());
  // }

  private uploadToAzureStorage(file: File, request: BlobFileRequest): Observable<number> {
    const azureClient = this.getAzureClient(request, this.authHelper);
    if (request.storageKind === StorageKind.Blobs) {
      return this.uploadToBlobStorage(azureClient as BlockBlobClient, file);
    } else if (request.storageKind === StorageKind.Files) {
      return this.uploadToFileStorage(azureClient as FileURL, file);
    }
    return of(null);
  }

  // private getContainerClient(request: BlobContainerRequest) {
  //   const blobServiceClient = this.getBlockBlobClient(request);
  //   return blobServiceClient.getContainerClient(request.containerName);
  // }

  private uploadToBlobStorage(azureClient: BlockBlobClient, file: File) {
    return new Observable<number>(observer => {
      azureClient
        .uploadBrowserData(file, {
          onProgress: this.onProgress(observer),
          blobHTTPHeaders: {
            blobContentType: file.type
          }
        })
        .then(
          this.onUploadComplete(observer, file),
          this.onUploadError(observer)
        );
    }).pipe(distinctUntilChanged());
  }
  private uploadToFileStorage(azureClient: FileURL, file: File) {
    return new Observable<number>(observer => {
      uploadBrowserDataToAzureFile(null, file, azureClient, {
        // rangeSize: 2 * 1024 * 1024,
        progress: this.onProgress(observer),
        fileHTTPHeaders: {
          fileContentType: file.type
        }
      })
        .then(
          this.onUploadComplete(observer, file),
          this.onUploadError(observer)
        );
    }).pipe(distinctUntilChanged());
  }

  private onUploadError(observer: Subscriber<number>) {
    return (error: RestError) => {
      console.error(error);
      return observer.error(error);
    };
  }

  private onUploadComplete(observer: Subscriber<number>, file: File) {
    return () => {
      observer.next(file.size);
      observer.complete();
    };
  }

  private onProgress(observer: Subscriber<number>) {
    return (progress: TransferProgressEvent) =>
      observer.next(progress.loadedBytes);
  }

  private mapUploadResponse = (file: File, options: BlobFileRequest): OperatorFunction<number, ItemUpload> =>
    source =>
      source.pipe(
        map(progress => ({
          ...options,
          progress: parseInt(((progress / file.size) * 100).toString(), 10),
          uploading: false
        })),
        startWith({
          ...options,
          progress: 0,
          uploading: false
        }),
        tap(item => {
          this.store.dispatch(new UpdateItemUploadProgress(item));
        })
      )

  // private mapDeleteResponse = (filename: string, options: BlobContainerRequest): OperatorFunction<BlobDeleteResponse, BlobItem> =>
  //   source =>
  //     source.pipe(
  //       map(() => ({
  //         filename,
  //         containerName: options.containerName
  //       })),
  //       startWith({
  //         filename,
  //         containerName: options.containerName
  //       })
  //     )

  private getDownloadUrlFromResponse = (): OperatorFunction<BlobDownloadResponseModel, string> =>
    source =>
      source.pipe(
        switchMap(res =>
          from(res.blobBody).pipe(
            map(body => window.URL.createObjectURL(body)),
            map(url => this.sanitizer.bypassSecurityTrustUrl(url) as string)
          )
        )
      )

  // private getStorageOptionsWithContainer(containerName: string): Observable<BlobContainerRequest> {
  //   return this.getStorageOptions().pipe(map(options => ({ ...options, containerName })));
  // }

  // private getStorageOptions(): Observable<BlobStorageRequest> {
  //   return this.sasGenerator.getBlobSasToken();
  // }

  private getStorageOptionsForUpload(fileName: string, url: string, method: 'get' | 'post', body?: any) {
    return this.sasGenerator.getUploadSasToken(fileName, url, method, body);
  }


  private getStorageOptionsForMultiUpload(fileNames: string[], url: string, method: 'get' | 'post', body?: any) {
    return this.sasGenerator.getUploadSasTokens(fileNames, url, method, body);
  }

  private asyncToObservable<T, TService>(iterable: PagedAsyncIterableIterator<T, TService>) {
    return new Observable<T>(
      observer =>
        void (async () => {
          try {
            for await (const item of iterable as AsyncIterable<T>) {
              if (observer.closed) { return; }
              observer.next(item);
            }
            observer.complete();
          } catch (e) {
            observer.error(e);
          }
        })()
    ).pipe(
      scan<T, T[]>((items, item) => [...items, item], []),
      startWith([] as T[])
    );
  }
}
