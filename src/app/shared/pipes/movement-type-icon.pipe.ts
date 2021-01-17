import { MovementType } from './../../team-core/models/enum';
import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'movementIcon',
    pure: true
})
export class MovementTypeIconPipe implements PipeTransform {


    movementType = MovementType;
    // mytaskGroupMode = MytaskGroupMode;


    transform(value: number, args?: any): any {
        if (value) {
            switch (value) {
                case 1:
                    return 'work';
                case 2:
                    return 'work_off';
                case 3:
                    return 'group_add';
                case 4:
                    return 'restaurant';
                case 5:
                    return 'local_library';
                case 6:
                    return 'flight';
                case 7:
                    return 'mood_bad';
                case 8:
                    return 'directions_walk';
                case 9:
                    return 'how_to_reg';
                case 10:
                    return 'local_library';
                case 11:
                    return 'mood_bad';
                case 12:
                    return 'directions_walk';
                case 13:
                    return 'local_library';
                case 14:
                    return 'mood_bad';
                case 15:
                    return 'directions_walk';
                case 16:
                    return 'local_library';
                case 17:
                    return 'free_breakfast';
                case 18:
                    return 'ring_volume';
                default:
                    return 'textsms';
            }
        }
        return '';
    }
}

