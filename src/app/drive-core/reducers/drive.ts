import * as Actions from '../actions/core';
import { DriveListItemWrapper, ItemView, ItemClipboard, CopyingItem, UploadingItem } from '../models/interfaces';
import { createSelector } from '@ngrx/store';
import { DriveItem, Drive, BaseItem } from '../../core/lib/microsoft-graph';
import { SEARCH_VIEW_ID, SESSION_UPLOAD_MAX } from '../models/const';
import { SafeBoxType } from '../../core';


export interface DriveState {
    readonly itemViews: ReadonlyArray<Readonly<ItemView>>;
    readonly loading: boolean;
    readonly roots: { drive: Drive, root: DriveItem, folders: DriveItem[] }[];
    readonly clipboard: ItemClipboard;
    readonly searchText: string;
    readonly copyingItems: { [location: string]: CopyingItem };
    readonly uploadingItems: { [url: string]: UploadingItem };
    readonly isCopying: boolean;
}
export interface State {
    readonly [token: string]: DriveState;
}

const initialState: State = {};
const initialDriveState: DriveState = {
    itemViews: [],
    roots: [],
    loading: false,
    clipboard: null,
    searchText: '',
    copyingItems: null,
    uploadingItems: null,
    isCopying: false,
};

export const createViewPath = (item: BaseItem) => {
    if (!!(item.parentReference && item.parentReference.path)) {
        return item.parentReference.path.replace(/^\/drive\//, '/drives/' + item.parentReference.driveId + '/') + '/' + item.name + ':';
    }
    return `/drives/${item.parentReference ? item.parentReference.driveId : item.id}/${item.name}`;
};


export function reducer(state = initialState, action: Actions.Any): State {
    const temp: any = {};
    switch (action.type) {
        case Actions.INIT_DRIVE:
            temp[action.token] = initDrive(state[action.token]);
            return { ...state, ...temp };

        case Actions.INIT_DRIVE_SUCCESS:
            temp[action.token] = { ...state[action.token], loading: false, roots: action.roots.slice() };
            return { ...state, ...temp };

        case Actions.INIT_DRIVE_FAIL:
            temp[action.token] = { ...state[action.token], loading: false };
            return { ...state, ...temp };

        case Actions.LIST_ITEMS:
            temp[action.token] = {
                ...state[action.token],
                itemViews: setItemLoading(state[action.token].itemViews, action.viewPath, true)
            };
            return { ...state, ...temp };

        case Actions.LIST_ITEM_SUCCESS:
            temp[action.token] = {
                ...state[action.token], itemViews: syncDriveItems(state[action.token].itemViews,
                    action.viewPath,
                    action.result.items,
                    action.result.skipToken,
                    action.startIndex
                )
            };
            return { ...state, ...temp };

        case Actions.LIST_ITEM_FAIL:
            temp[action.token] = {
                ...state[action.token],
                itemViews: setItemLoading(state[action.token].itemViews, action.viewPath, false)
            };
            return { ...state, ...temp };

        case Actions.ADD_NEW_FILE:
            temp[action.token] = {
                ...state[action.token],
                itemViews: setItemLoading(state[action.token].itemViews, action.viewPath, true)
            };
            return { ...state, ...temp };

        case Actions.VIEW_FOLDER:
            temp[action.token] = {
                ...state[action.token],
                itemViews: setActiveView(state[action.token].itemViews, action.item), searchText: ''
            };
            return { ...state, ...temp };

        case Actions.SELECT_ITEM:
            temp[action.token] = {
                ...state[action.token],
                itemViews: selectViewItem(state[action.token].itemViews, action.wrapper, action.viewPath, action.isMulti)
            };
            return { ...state, ...temp };

        case Actions.PASTE_ITEMS:
            temp[action.token] = {
                ...state[action.token],
                isCopying: action.copyFrom === SafeBoxType.Drive && (state[action.token].clipboard.type === 'copy' ||
                    action.destItem.parentReference.driveId !== state[action.token].clipboard.items[0].parentReference.driveId)
            };
            return { ...state, ...temp };

        case Actions.CUT_OR_COPY_ITEMS:
            temp[action.token] = {
                ...state[action.token],
                clipboard: copyToItemClipboard(state[action.token].itemViews, action.viewPath, action.pasteType)
            };
            return { ...state, ...temp };

        case Actions.SET_COPYING_ITEM:
            temp[action.token] = {
                ...state[action.token],
                copyingItems: setCopyingItem(state[action.token].copyingItems, action.payload),
                isCopying: false
            };
            return { ...state, ...temp };

        case Actions.CLEAR_COPYING_ITEMS:
            temp[action.token] = {
                ...state[action.token],
                copyingItems: null
            };
            return { ...state, ...temp };

        case Actions.SESSION_UPLOAD:
            temp[action.token] = {
                ...state[action.token],
                uploadingItems: setUploadingItem(state[action.token].uploadingItems,
                    action.file, action.uploadUrl, action.index, action.status)
            };
            return { ...state, ...temp };

        case Actions.SESSION_UPLOAD_COMPLEAT:
            temp[action.token] = {
                ...state[action.token],
                uploadingItems: null
            };
            return { ...state, ...temp };

        case Actions.CLEAR_CLIP_BOARD:
            temp[action.token] = {
                ...state[action.token],
                clipboard: null
            };
            return { ...state, ...temp };

        case Actions.CLEAR_OR_REFRESH_ITEM_VIEW:
            temp[action.token] = {
                ...state[action.token],
                itemViews: clearItemView(state[action.token].itemViews, action.viewPath)
            };
            return { ...state, ...temp };

        case Actions.CHANGE_SORT_ORDER:
            temp[action.token] = {
                ...state[action.token],
                itemViews: changeSortOrder(state[action.token].itemViews, action.viewPath, action.sortBy, action.orderBy)
            };
            return { ...state, ...temp };

        case Actions.SEARCH_DRIVE:
            temp[action.token] = {
                ...state[action.token],
                itemViews: startSearch(state[action.token].itemViews, action.drive, action.searchText), searchText: action.searchText
            };
            return { ...state, ...temp };

        case Actions.RENAME_ITEM_SUCCESS:
            temp[action.token] = {
                ...state[action.token],
                itemViews: renameViewItem(state[action.token].itemViews, action.item)
            };
            return { ...state, ...temp };

        case Actions.DELETE_ITEMS_SUCCESS:
            temp[action.token] = {
                ...state[action.token],
                itemViews: deleteViewItem(state[action.token].itemViews, action.items)
            };
            return { ...state, ...temp };

        default:
            {
                return state;
            }
    }
}

const itemViewUtil = (view: Readonly<ItemView>) => {

    const createWrapper = (item: DriveItem): DriveListItemWrapper => {
        return { selected: false, data: item };
    };


    const isSearchView = (): boolean => {
        return view.viewPath === SEARCH_VIEW_ID;
    };

    const viewPathToNavigation = (drives: Drive[]) => {
        let folders = [];

        if (isSearchView() && !!view.owner) {
            folders.push({
                label: view.owner.name,
                driveId: view.owner.id,
                viewPath: `/drives/${view.owner.id}/root`
            });
            return folders;
        }

        const rootPtn = /^\/drives\/(.+?)\/root/;
        const parts0 = rootPtn.exec(view.viewPath);

        if (parts0) {
            const driveId = parts0[1];
            const drive = drives.find((_dirve) => _dirve.id === driveId);
            folders.push({
                label: drive ? drive.name : 'Files',
                driveId: driveId,
                viewPath: `/drives/${driveId}/root`
            });
        }

        const fullPtn = /^\/drives\/(.+?)\/root:?\/(.+?):/;
        const parts = fullPtn.exec(view.viewPath);

        if (parts) {
            const driveId = parts[1];
            const relPath = parts[2]
                .split('/')
                .reduce((paths, name) => {
                    const fullPath = (paths.length > 0 ? paths[paths.length - 1].path : '') + `/${name}`;
                    paths.push({ path: fullPath, label: name });
                    return paths;
                }, [])
                .map(({ path, label }) => ({
                    label: label,
                    driveId: driveId,
                    viewPath: `/drives/${driveId}/root:${path}:`
                }));
            folders = folders.concat(relPath);
        }
        return folders;
    };

    const syncItems = (items: DriveItem[], skipToken: string, startIndex: number): Partial<ItemView> => {
        const head = view.order.slice(0, startIndex);
        const tail = view.order.slice(startIndex + items.length);
        const _order = head.concat(items.map((_item) => _item.id).concat(tail));
        const newCache = items.reduce((hash, value) => {
            hash[value.id] = value;
            return hash;
        }, {});

        const _itemCache = _order.map((id) => {
            if (id in newCache) {
                if (id in view.itemCache) {
                    const wrapper = view.itemCache[id];
                    return {
                        ...wrapper,
                        data: newCache[id],
                    };
                } else {
                    return createWrapper(newCache[id]);
                }
            } else {
                return view.itemCache[id];
            }
        }).reduce((acc, value) => {
            acc[value.data.id] = value;
            return acc;
        }, {});

        return { itemCache: _itemCache, order: _order, skipToken: skipToken };
    };

    const isLoaded = () => {
        return view.loaded;
    };

    const toNewSearch = (drive: Drive, searchText: string): Partial<ItemView> => {
        return {
            itemCache: {},
            order: [],
            skipToken: null,
            loaded: false,
            searchText: searchText,
            owner: drive
        };
    };

    const getItems = () => {
        return view.order.map((id) => view.itemCache[id]);
    };

    const selectItem = (id, isMulti): Partial<ItemView> => {
        const _itemCache = Object.keys(view.itemCache).reduce((acc, _id) => {
            acc[_id] = view.itemCache[_id];
            if (!isMulti && view.itemCache[_id].selected) {
                acc[_id] = { ...view.itemCache[_id], selected: false };
            }
            if (id === _id) {
                acc[_id] = { ...view.itemCache[_id], selected: isMulti ? !view.itemCache[_id].selected : true };
            }
            return acc;
        }, {});

        return { itemCache: _itemCache };
    };
    const renameItem = (item: DriveItem): Partial<ItemView> => {
        const _itemCache = Object.keys(view.itemCache).reduce((acc, _id) => {

            if (_id === item.id) {
                acc[_id] = { ...view.itemCache[_id], data: item };
            } else {
                acc[_id] = view.itemCache[_id];
            }
            return acc;
        }, {});

        return { itemCache: _itemCache };
    };
    const deleteItems = (items: DriveItem[]): Partial<ItemView> => {
        const _view = Object.assign({}, view, {
            itemCache: Object.keys(view.itemCache).reduce((acc, _id) => {

                if (!items.find(val => val.id === _id)) {
                    acc[_id] = view.itemCache[_id];
                }
                return acc;
            }, {}),
            order: view.order.filter(val => !items.find(item => item.id === val))
        });
        return _view;
    };
    const setInactive = (): Partial<ItemView> => {
        return { active: false, ...selectItem('dummy', false) };
    };

    const setActive = (item: BaseItem): Partial<ItemView> => {
        return { active: true, owner: item, ...selectItem('dummy', false) };
    };

    const setLoading = (val): Partial<ItemView> => {
        return { loading: val };
    };

    const createClipbord = (type): ItemClipboard => {
        const items = Object.keys(view.itemCache)
            .map((id) => view.itemCache[id])
            .filter((item) => item.selected)
            .map((item) => item.data);

        return { items: items, viewPath: view.viewPath, type };
    };

    const getNextRequestInfo = () => {
        if (view.loaded && !view.skipToken) {
            return null;
        }

        return {
            skipToken: view.skipToken,
            path: isSearchView() ? `/drives/${view.owner.id}/root/search(q='${view.searchText}')` : createViewPath(view.owner),
            startIndex: view.order.length,
            sortBy: view.sortBy,
            orderBy: view.orderBy
        };
    };
    const getSortOrder = () => {
        return {
            sortBy: view.sortBy,
            orderBy: view.orderBy
        };
    };

    const hasMoreItems = () => {
        return view.skipToken != null;
    };

    return {
        getNextRequestInfo,
        syncItems,
        isLoaded,
        getItems,
        selectItem,
        renameItem,
        deleteItems,
        hasMoreItems,
        createClipbord,
        setInactive,
        setActive,
        setLoading,
        viewPathToNavigation,
        toNewSearch,
        getSortOrder
    };
};

function initDrive(state: DriveState): DriveState {
    if (state && state.roots && state.roots.length > 0) {
        return state;
    }
    return { ...state, ...initialDriveState, loading: true };
}

function createDefultItemView(viewPath: string): ItemView {
    return {
        itemCache: {},
        viewPath: viewPath,
        loading: false,
        active: false,
        order: [],
        loaded: false,
        skipToken: null,
        owner: null,
        searchText: null,
        sortBy: '',
        orderBy: ''
    };
}

function setActiveView(itemViews: ReadonlyArray<Readonly<ItemView>>, item: BaseItem) {
    const viewPath = createViewPath(item);
    return ensureItemView(itemViews, viewPath)
        .map((view) => {
            if (view.viewPath === viewPath) {
                return { ...view, active: true, owner: item };
            } else if (view.active) {
                return { ...view, active: false };
            }
            return view;
        });
}

function setItemLoading(itemViews: ReadonlyArray<Readonly<ItemView>>, viewPath: string, value: boolean) {
    return itemViews
        .map((view) => {
            if (view.viewPath === viewPath) {
                const mutated = itemViewUtil(view).setLoading(value);
                return { ...view, ...mutated };
            }
            return view;
        });
}

function clearItemView(itemViews: ReadonlyArray<Readonly<ItemView>>, viewPath: string) {
    return itemViews.reduce((all, view) => {
        if (view.viewPath === viewPath && view.active) {
            all.push({ ...createDefultItemView(viewPath), active: true, owner: view.owner, sortBy: view.sortBy, orderBy: view.orderBy });
        } else if (view.viewPath !== viewPath) {
            all.push(view);
        }
        return all;
    }, []);
}
function changeSortOrder(itemViews: ReadonlyArray<Readonly<ItemView>>, viewPath: string, sortBy: string, orderBy: string) {
    return itemViews.reduce((all, view) => {
        if (view.viewPath === viewPath && view.active) {
            all.push({ ...createDefultItemView(viewPath), active: true, owner: view.owner, sortBy, orderBy });
        } else if (view.viewPath !== viewPath) {
            all.push(view);
        }
        return all;
    }, []);
}

function startSearch(itemViews: ReadonlyArray<Readonly<ItemView>>, drive: Drive, searchText: string) {
    return ensureItemView(itemViews, SEARCH_VIEW_ID)
        .map((view) => {
            if (view.viewPath === SEARCH_VIEW_ID) {
                const mutated = itemViewUtil(view).toNewSearch(drive, searchText);
                return { ...view, ...mutated, active: true };
            } else if (view.active) {
                return { ...view, active: false };
            }
            return view;
        });
}

function selectViewItem(itemViews: ReadonlyArray<Readonly<ItemView>>, wrapper: DriveListItemWrapper, viewPath: string, isMulti: boolean) {
    return itemViews
        .map((view) => {
            if (view.viewPath === viewPath) {
                const mutated = itemViewUtil(view).selectItem(wrapper.data.id, isMulti);
                return { ...view, ...mutated };

            }
            return view;
        });
}

function renameViewItem(itemViews: ReadonlyArray<Readonly<ItemView>>, item: DriveItem) {
    return itemViews
        .map((view) => {
            const mutated = itemViewUtil(view).renameItem(item);
            return { ...view, ...mutated };
        });
}

function deleteViewItem(itemViews: ReadonlyArray<Readonly<ItemView>>, items: DriveItem[]) {
    return itemViews
        .map((view) => {
            const mutated = itemViewUtil(view).deleteItems(items);
            return { ...view, ...mutated };
        });
}

function copyToItemClipboard(itemViews: ReadonlyArray<Readonly<ItemView>>, viewPath: string, type): ItemClipboard {
    const view = itemViews.find((_view) => _view.viewPath === viewPath);
    if (!view) {
        return null;
    }
    return itemViewUtil(view).createClipbord(type);
}
function setCopyingItem(copyingItems: { [location: string]: CopyingItem; },
    copyingItem: CopyingItem): { [location: string]: CopyingItem; } {
    const temp = {};
    temp[copyingItem.location] = copyingItem;
    return { ...copyingItems, ...temp };
}

function setUploadingItem(uploadingItems: { [url: string]: UploadingItem }, file: File, url: string,
    index: number, status: 'completed' | 'inProgress' | 'error') {
    const temp: { [url: string]: UploadingItem } = {};
    let percentage = 0;
    if (status === 'inProgress' && file.size > 0) {
        percentage = (index * SESSION_UPLOAD_MAX * 100) / file.size;
    } else if (status === 'completed') {
        percentage = 100;
    }
    temp[url] = {
        name: file.name,
        uploadUrl: url,
        percentageComplete: percentage,
        status
    };
    return { ...uploadingItems, ...temp };
}

function ensureItemView(itemViews: ReadonlyArray<Readonly<ItemView>>, viewPath: string) {
    const has = itemViews.find((view) => view.viewPath === viewPath);
    if (has) {
        return itemViews;
    }
    return itemViews.concat([createDefultItemView(viewPath)]);
}

function syncDriveItems(itemViews: ReadonlyArray<Readonly<ItemView>>,
    viewPath: string, items: DriveItem[], skipToken: string, startIndex: number) {

    return ensureItemView(itemViews, viewPath)
        .map((view) => {
            if (view.viewPath === viewPath) {
                const mutated = itemViewUtil(view).syncItems(items, skipToken, startIndex);
                return { ...view, ...mutated, loaded: true, loading: false };
            }
            return view;
        });
}

export const getState = (state: State) => state;

export const getView = (token) => createSelector(getState, (state) => state[token]);

export const getItemViews = (token) => createSelector(getView(token), (view) => view.itemViews);

export const getRootLoading = (token) => createSelector(getView(token), (view) => view.loading);

export const getActiveView = (token) => createSelector(getItemViews(token), (views) => views.find((view) => view.active));

export const hasClipboardItems = (token) => createSelector(getView(token), (view) => view.clipboard && view.clipboard.items.length > 0);

export const getItemClipboard = (token) => createSelector(getView(token), (view) => view ? view.clipboard : null);

export const getSearchText = (token) => createSelector(getView(token), (view) => view.searchText);

export const getItemViewByViewPath = (viewPath, token) => {
    return createSelector(getItemViews(token), (cache) => cache.find((view) => view.viewPath === viewPath));
};

export const getItemsListByViewPath = (viewPath, token) => {
    return createSelector(getItemViewByViewPath(viewPath, token), (view) => itemViewUtil(view).getItems());
};

export const getNextRequestInfoByViewPath = (viewPath, token) => {
    return createSelector(getItemViewByViewPath(viewPath, token), (view) => itemViewUtil(view).getNextRequestInfo());
};
export const getSortOrderByViewPath = (viewPath, token) => {
    return createSelector(getItemViewByViewPath(viewPath, token), (view) => itemViewUtil(view).getSortOrder());
};

export const getViewLoadingByViewPath = (viewPath, token) => {
    return createSelector(getItemViewByViewPath(viewPath, token), (view) => view.loading);
};

export const isItemLoaded = (viewPath, token) => {
    return createSelector(getItemViewByViewPath(viewPath, token), (view) => itemViewUtil(view).isLoaded());
};

export const getHasMoreItems = (viewPath, token) => {
    return createSelector(getItemViewByViewPath(viewPath, token), (view) => itemViewUtil(view).hasMoreItems());
};


export const getStikeyFolders = (token) => createSelector(getView(token), (view) => view.roots);

export const getViewPathToNavigation = (viewPath, token) => {
    return createSelector(getItemViewByViewPath(viewPath, token), getStikeyFolders(token), (view, roots) =>
        itemViewUtil(view).viewPathToNavigation(roots.map((info) => info.drive)));
};

export const getActiveDrive = (token) => createSelector(getActiveView(token), getStikeyFolders(token), (view, drives) => {
    if (view && view.owner && drives && drives.length > 0) {
        return drives.find(val => val.drive.id === view.owner.id ||
            (view.owner.parentReference && val.drive.id === view.owner.parentReference.driveId)).drive;
    }
    return null;
});

export const getCopyingItems = (token) => createSelector(
    getView(token), (view) => view.copyingItems ? Object.keys(view.copyingItems).map(key => view.copyingItems[key]) : []
);
export const getIsCopying = (token) => createSelector(getView(token), (view) => view.isCopying);
export const getUploadingItems = (token) => createSelector(
    getView(token), (view) => view.uploadingItems ? Object.keys(view.uploadingItems).map(key => view.uploadingItems[key]) : []
);
// export const getStikeyFolders = (state: State) => {
//     let r: DriveItem[] = [];
//     state.roots.forEach((dirveInfo) => {
//         r = r.concat(dirveInfo.folders);
//     });
//     return r;
// };

