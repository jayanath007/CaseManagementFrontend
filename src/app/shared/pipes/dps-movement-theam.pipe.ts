import { MovementType } from './../../team-core/models/enum';
import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'movementTheamClass',
    pure: true
})
export class DpsMovementTheamPipe implements PipeTransform {


    movementType = MovementType;
    // mytaskGroupMode = MytaskGroupMode;


    transform(value: number, args?: any): any {
        if (value) {
            switch (value) {
                case 1:
                    return 'signIn-for-work';
                case 2:
                    return 'signOut-from-work';
                case 3:
                    return 'in-meeting';
                case 4:
                    return 'at-lunch';
                case 5:
                    return 'training';
                case 6:
                    return 'travelling';
                case 7:
                    return 'sick';
                case 8:
                    return 'holiday';
                case 9:
                    return 'signIn-for-work';
                case 10:
                    return 'training';
                default:
                    return 'insert_drive_file';
            }
        }
        return '';
    }
}

