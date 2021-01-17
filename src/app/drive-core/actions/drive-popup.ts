import { Action } from '@ngrx/store';
import { BaseItem } from '../../core/lib/microsoft-graph';

export const OPEN_FOLDER = 'DPS_DRIVE_OPEN_FOLDER';

export class OpenFolder implements Action {
    readonly type = OPEN_FOLDER;
    constructor(public item: BaseItem) {
    }
}
