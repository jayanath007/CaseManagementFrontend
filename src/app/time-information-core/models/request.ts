import { CrimeClassIdentityViewModel } from '../../core/lib/timeRecord';

export class CrimeTimeDeleteViewModel {
    constructor(public crimeClassIdentityViewModel: CrimeClassIdentityViewModel,
        public timID: number,
        public diaryRef: number
    ) { }

    public RequestToPost() {
        return {
            CrimeClassIdentityViewModel: this.crimeClassIdentityViewModel,
            TimeId: this.timID,
            DiaryId: this.diaryRef
        };
    }
}
