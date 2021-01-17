import { CaseFileIdentityWithAppIdViewModel } from '../../core/lib/files';
import { DatePipe } from '@angular/common';


export class AddNewClassRequest {
    constructor(public identityWithAppIdViewModel: CaseFileIdentityWithAppIdViewModel,
        public classId: number,
        public className: string,
        public openDate: string) { }

    public DataRequestToPost() {
        return {
            CaseFileIdentityWithAppIdViewModel: this.identityWithAppIdViewModel,
            ClassId: this.classId,
            ClassName: this.className,
            OpenDate: new DatePipe('en-US').transform(this.openDate, 'yyyy-MM-ddTHH:mm')
        };
    }
}


