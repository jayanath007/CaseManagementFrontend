import { Message } from './microsoft-graph';

export interface FileUrlCache {
    view: string | Message;
    download: string;
    ttl?: string;
    loading: boolean;
}

export class CaseFileIdentityWithAppIdViewModel {
    branchId: number;
    appId: number;
    fileId: number;
    displayDataString: string;
}

export function getFileExtentionByName(fileName) {
    const p = fileName.split('.');
    return p[p.length - 1];
}

export function checkExceedsMaximumFileSize(file: File, maxSize: number): boolean {
    if (file && file.size) {
        if (getConvertFileToMB(file) > maxSize) { // limit to 30mb
            return true;
        }
    }
    return false;
}

export function getConvertFileToMB(file: File): number {
    if (file) {
        return (file.size / (1024 * 1024));
    }
    return 0;
}



