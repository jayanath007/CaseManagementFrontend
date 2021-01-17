
import {switchMap, filter} from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { DriveListItemWrapper, ItemView } from '../models/interfaces';
import { of ,  Observable } from 'rxjs';
import { getItemsListByViewPath, getActiveView } from '../reducers';
import { SAFE_BOX_DRIVE_TOKEN } from '../models/const';

export class BaseDriveFileItemViewManager {
    activeView$: Observable<ItemView> = of(null);
    itemList$: Observable<DriveListItemWrapper[]> = of([]);
    constructor(protected store: Store<any>) {

    }
    onInit() {
        this.activeView$ = this.store.select(getActiveView(SAFE_BOX_DRIVE_TOKEN)).pipe(filter((view) => !!view));

        this.itemList$ = this.activeView$.pipe(
            switchMap((view) => this.store.select(getItemsListByViewPath(view.viewPath, SAFE_BOX_DRIVE_TOKEN))));
    }
}
