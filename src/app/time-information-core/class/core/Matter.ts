import { dpsNewDate } from '../../../utils/javascriptDate';
import { convertUFNString } from '../../../core/lib/matter';

export class Matter {
    constructor(public fileID: number,
        public appID: number,
        public branchID: number,
        public UFN: string,
        public timeOffset: string) {

    }

    public getFileID() {
        return this.fileID;
    }

    public getAppID() {
        return this.appID;
    }

    public getBranchID() {
        return this.branchID;
    }

    public getUFN() {
        return this.UFN;
    }

    public GetUFNDate(): Date {
        // get date from UFN (yy/MM/dd)
        let ufnDate = dpsNewDate(this.timeOffset);
        if (this.UFN != null && this.UFN.length >= 6) {
            const dateStr = convertUFNString(this.UFN);
            try {
                // NTC todo
                ufnDate = new Date(dateStr);
                // ufnDate = df.parse(dateStr);
            } catch (e) {
                console.log('Failed to parse UFN date');
            }
        }
        return ufnDate;
    }
}
