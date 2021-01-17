import { MatterInfo } from './../../core/lib/matter';
import { MLSUser } from '../../core/lib/mls';

export class SendMessageRequest {
    constructor(public msgText: string,
        public senderEmail: string,
        public toUserEmail: string,
        public appID: number,
        public branchID: number,
        public fileID: number) { }

    public toPost() {
        return {
            text: this.msgText,
            senderEmail: this.senderEmail,
            dateViewed: null,
            docVersionID: null,
            appID: this.appID,
            branchID: this.branchID,
            fileID: this.fileID,
            datePosted: null,
            sourceMessageID: null,
            toUserEmail: this.toUserEmail
        };
    }
}

