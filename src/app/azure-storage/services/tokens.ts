import { InjectionToken } from '@angular/core';
import * as BlobStorage from '@azure/storage-blob';
import * as FileStorage from '@azure/storage-file';
import {
  AzureStorageClientFactory,
  AzureStorageRequest,
  StorageKind
} from '../models/interfaces';
import { AuthInfoStateService } from '../../auth';


class BlobSasUpdatePolicy extends BlobStorage.BaseRequestPolicy {
  constructor(nextPolicy, options, private token: string, private authHelper: AuthInfoStateService) {
    super(nextPolicy, options);
  }

  async sendRequest(request: BlobStorage.WebResource) {
    const authToken = await this.authHelper.acquireDpsV3ApiToken().toPromise();
    request.headers.set('Authorization', `Bearer ${authToken}`);
    request.headers.set('X-DPS-FS-Token', this.token);
    request.headers.set('X-DPS-DatabaseId', this.authHelper.getSelectedDatabase());
    request.headers.set('traceparent', this.authHelper.getNewTraceparent());
    return this._nextPolicy.sendRequest(request);
  }
}

class FileSasUpdatePolicy extends FileStorage.BaseRequestPolicy {
  constructor(nextPolicy, options, private token: string, private authHelper: AuthInfoStateService) {
    super(nextPolicy, options);
  }

  async sendRequest(request: FileStorage.WebResource) {
    const authToken = await this.authHelper.acquireDpsV3ApiToken().toPromise();
    request.headers.set('Authorization', `Bearer ${authToken}`);
    request.headers.set('X-DPS-FS-Token', this.token);
    request.headers.set('X-DPS-DatabaseId', this.authHelper.getSelectedDatabase());
    request.headers.set('traceparent', this.authHelper.getNewTraceparent());
    return this._nextPolicy.sendRequest(request);
  }
}

class BlobSasUpdatePolicyFactory {
  constructor(private options: AzureStorageRequest, private authHelper: AuthInfoStateService) { }

  create(nextPolicy, options) {
    return new BlobSasUpdatePolicy(nextPolicy, options, this.options.token, this.authHelper);
  }

}
class FileSasUpdatePolicyFactory {
  constructor(private options: AzureStorageRequest, private authHelper: AuthInfoStateService) { }

  create(nextPolicy, options) {
    return new FileSasUpdatePolicy(nextPolicy, options, this.options.token, this.authHelper);
  }

}

export const AZURE_STORAGE_TOKEN = new InjectionToken<AzureStorageClientFactory>(
  'AZURE_STORAGE_TOKEN'
);

export function azureStorageFactory(): AzureStorageClientFactory {
  const getBlobPipeline = (options: AzureStorageRequest, authHelper: AuthInfoStateService) => {
    const anonymousCredential = new BlobStorage.AnonymousCredential();
    const pipeline = BlobStorage.newPipeline(anonymousCredential, {
      // httpClient: MyHTTPClient, // A customized HTTP client implementing IHttpClient interface
      retryOptions: { maxTries: 4 },
      userAgentOptions: { userAgentPrefix: 'Sample V1.0.0' } // Customized telemetry string
    });
    pipeline.factories.unshift(new BlobSasUpdatePolicyFactory(options, authHelper));
    return pipeline;
  };
  const getFilePipeline = (options: AzureStorageRequest, authHelper: AuthInfoStateService) => {
    const anonymousCredential = new FileStorage.AnonymousCredential();
    const pipeline = FileStorage.StorageURL.newPipeline(anonymousCredential, {
      // httpClient: MyHTTPClient, // A customized HTTP client implementing IHttpClient interface
      retryOptions: { maxTries: 4 },
      // userAgentOptions: { userAgentPrefix: 'Sample V1.0.0' } // Customized telemetry string
    });
    pipeline.factories.unshift(new FileSasUpdatePolicyFactory(options, authHelper));
    return pipeline;
  };
  return (options, authHelper) => {
    if (options.storageKind === StorageKind.Blobs) {
      return new BlobStorage.BlockBlobClient(options.url, getBlobPipeline(options, authHelper));
    } else if (options.storageKind === StorageKind.Files) {
      return new FileStorage.FileURL(options.url, getFilePipeline(options, authHelper));
    }
    return null;
  };
}
