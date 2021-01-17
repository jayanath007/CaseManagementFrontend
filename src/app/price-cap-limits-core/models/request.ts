import { UserInputData } from './interfaces';
import { CrimeClassIdentityViewModel } from './../../core/lib/timeRecord';
import { UserInputDataEnum } from './enum';
import { DatePipe } from '@angular/common';

export class CrimeLimitHistoryViewModel {
    constructor(private model: CrimeClassIdentityViewModel, private userInput: UserInputData,
        private user: string) { }

    public toPost() {

        return {
            CrimeClassIdentityViewModel: this.model,
            MatterFileId: this.model.fileId,
            LimitType: this.userInput[UserInputDataEnum.limitedType],
            PostedDate: this.userInput[UserInputDataEnum.postingData] ?
                new DatePipe('en-US').transform(this.userInput[UserInputDataEnum.postingData], 'yyyy-MM-dd HH:mm') : null,
            User: this.user,
            LimitValue: this.userInput[UserInputDataEnum.newLimit],
            BranchId: this.model.branchId,
            GeneratedDate: this.userInput[UserInputDataEnum.grantedDate] ?
                new DatePipe('en-US').transform(this.userInput[UserInputDataEnum.grantedDate], 'yyyy-MM-dd HH:mm') : null,
        };
    }
}


