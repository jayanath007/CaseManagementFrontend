import { Injectable } from '@angular/core';

@Injectable()
export abstract class DriveMailIntegration {
    abstract attachDriveFilesToMail(driveId: string, driveItems: string[], mailItemId: string);
    abstract downloadMailAttachmentToOneDrive(driveId: string, parentFolderId: string, attachementIds: string[]);
}
