
import { CrimeClassIdentityViewModel } from '../../core/lib/timeRecord';
import { UserInputData, LimitHistory } from '../models/interfaces';
import { UserInputDataEnum, ValidationMessages } from '../models/enum';

export class ValidateAddTimeToHistory {
    private userInput: UserInputData;
    private crimeClassIdentify: CrimeClassIdentityViewModel;
    private limitHistory: LimitHistory[];


    constructor(_UserInput: UserInputData, _CrimeClassIdentify: CrimeClassIdentityViewModel, _LimitHistory: LimitHistory[]) {
        this.userInput = _UserInput;
        this.crimeClassIdentify = _CrimeClassIdentify;
        this.limitHistory = _LimitHistory;
    }

    public validateAddTime()
        : { valid: boolean, msg?: string } {
        if (this.userInput[UserInputDataEnum.limitedType] <= 0) {
            return { valid: false, msg: ValidationMessages.limitedType };
        } else if (this.userInput[UserInputDataEnum.newLimit] < 0) {
            return { valid: false, msg: ValidationMessages.newLimit };
        } else if (this.isLimitValueIsAlreadyExist()) {
            return { valid: false, msg: ValidationMessages.limitAlredyExit };
        } else {
            return { valid: true };
        }
    }

    private isLimitValueIsAlreadyExist(): boolean {
        if (this.limitHistory && this.limitHistory.length > 0) {
            const findMatch = this.limitHistory.find(l => (
                l.matterFileId === this.crimeClassIdentify.fileId &&
                l.branchId === this.crimeClassIdentify.branchId &&
                l.limitType === this.userInput[UserInputDataEnum.limitedType] &&
                parseInt(l.limitValue.toString(), 0) === parseInt(this.userInput[UserInputDataEnum.newLimit].toString(), 0)
            ));
            if (!!findMatch) {
                return true;
            }
        }
        return false;
    }

}
