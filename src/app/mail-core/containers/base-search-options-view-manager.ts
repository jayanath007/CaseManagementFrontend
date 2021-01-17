import { Store } from '@ngrx/store';
import { SerchMessageListActions } from '../models/enums';
import { SearchViewChange, ExitSearch } from '../actions/items';

export class BaseSearchOptionsViewManager {
    constructor(public store: Store<any>) { }
    public searchViewChange({changes, folderId}) {
        this.store.dispatch(new SearchViewChange({ changes, folderId }));
    }
    public exitSearch( folderId: string) {
        this.store.dispatch(new ExitSearch({ folderId }));
    }
}
