import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';

import * as Actions from '../actions/items';
import * as ItemActions from '../../mail-item-core/actions/item';
import { MailItemRequest, MailItemResponse } from '../models/requests';
import { MessageListActions, FilterTypes, OrderBy, SortDir, SerchDateTypes, SerchMessageListActions } from '../models/enums';
import {
    Message, EventMessage, FollowupFlag,
    SingleValueLegacyExtendedProperty, FileAttachment
} from '../../core/lib/microsoft-graph';
import { SearchOptions } from '../models/interfaces';
import { RecipientColorCodePipe } from '../../shared/pipes/recipient-color-code.pipe';
import { NameInitialsPipe } from '../../shared/pipes/name-initials.pipe';

import { SEARCH_VIEWID } from '../models/const';
import { MessageItemWrapper } from '../../mail-item-core';
import { FileUrlCache } from '../../core/lib/files';
import { isMobile } from '../../utils/is-mobile';

export interface State {
    readonly folderViews: ReadonlyArray<Readonly<ItemViewState>>;
    readonly useVirtualScrolling: boolean;
}

export interface ItemMap { [id: string]: Readonly<MessageItemWrapper>; }
export type ImmutableItemMap = Readonly<ItemMap>;
export type ViewCacheList = ReadonlyArray<Readonly<ItemFilterState>>;

export interface ItemViewState {
    readonly viewId: string;
    readonly active: boolean;
    readonly items: ImmutableItemMap;
    readonly viewCache: ViewCacheList;
    readonly itemPerPage: number;
    readonly orderBy: OrderBy;
    readonly sortDir: SortDir;
    readonly filter: FilterTypes;
    readonly search: SearchOptions;
    readonly pageIndex: number;
    readonly isSearching: boolean;
    readonly autoReadItemId: string;
    readonly viewingIndex: number;
}

export interface ItemRequestInfo {
    readonly isSearching: boolean;
    readonly orderBy: OrderBy;
    readonly sortDir: SortDir;
    readonly filter: FilterTypes;
    readonly size: number;
    readonly start: number;
    readonly hash: string;
    readonly folderId: string;
    readonly searchText: string;
    readonly isAllFolders: boolean;
    readonly hasAttachment: boolean;
    readonly from: string;
    readonly dateType: SerchDateTypes;
    readonly dateFrom: string;
    readonly dateTo: string;
}

export interface HashLeaf {
    suffix: string;
    loaded: boolean;
    loading: boolean;
}

export interface ItemFilterState {
    readonly hashRoot: string;
    readonly hashLeaf: HashLeaf[];
    readonly lastTouch: Date;
    readonly order: ReadonlyArray<string>;
    readonly totalItems: number;
}

const HASH_JOINT = '^';

const initialState: State = Object.freeze({ folderViews: Object.freeze([]), useVirtualScrolling: !isMobile().any() });

export function reducer(state: State = initialState, actions: Actions.Any | ItemActions.Any): State {

    // for debug only
    try {

        switch (actions.type) {

            case Actions.ENSURE_LIST_VIEW_CHANGE:
                return {
                    ...state,
                    folderViews: ensureViewChanges(state.folderViews, actions.payload.viewId, actions.payload.changes)
                };

            case Actions.EXIT_SEARCH:
                return {
                    ...state,
                    folderViews: exitSearch(state.folderViews)
                };

            case Actions.SET_ACTIVE_VIEW:
                return {
                    ...state,
                    folderViews: setActiveView(state.folderViews, actions.payload.viewId)
                };

            case Actions.LOAD_MAIL_MESSAGE_ITEMS:
                return {
                    ...state, folderViews: preItemLoad(state.folderViews,
                        actions.payload)
                };

            case Actions.MAIL_MESSAGE_ITEM_LOAD_SUCCESS:
                return {
                    ...state,
                    folderViews: messageItemLoadSuccess(state.folderViews, actions.payload.request, actions.payload.response)
                };
            case Actions.MAIL_MESSAGE_ITEM_LOAD_FAIL:
                return {
                    ...state,
                    folderViews: messageItemLoadSuccess(state.folderViews, actions.payload, new MailItemResponse([], 0))
                };

            case Actions.NEW_MAIL_ITEMS_RECEIVED: {
                const folderViews = syncItemAddUpdateByEvents(state.folderViews, actions.payload.item, actions.payload.wellKnownName, 'me');
                if (state.folderViews === folderViews) {
                    return state;
                }
                return {
                    ...state,
                    folderViews: folderViews
                };
            }

            case Actions.REPLACE_ITEMS: {
                const folderViews = syncItemAddUpdateByEvents(state.folderViews,
                    actions.payload.item, actions.payload.wellKnownName, actions.payload.owner);
                if (state.folderViews === folderViews) {
                    return state;
                }
                return {
                    ...state,
                    folderViews: folderViews
                };
            }

            case Actions.REMOVE_FOLDER_VIEW: {
                const folderViews = removeFolderView(state.folderViews, actions.payload.viewId);
                if (state.folderViews === folderViews) {
                    return state;
                }
                return {
                    ...state,
                    folderViews: folderViews
                };
            }

            case ItemActions.GET_OUTLOOK_JOURNAL_STATUS_SUCCESS:
                return {
                    ...state,
                    folderViews: setJournalStatus(state.folderViews, actions.payload)
                };
            case ItemActions.REMOVE_OUTLOOK_JOURNAL_STATUS:
                return {
                    ...state,
                    folderViews: removeJournalStatus(state.folderViews, actions.payload)
                };

            case ItemActions.READ_UNREAD_ITEMS:
                return {
                    ...state,
                    folderViews: readUnreadItems(state.folderViews, actions.payload.items, actions.payload.isRead)
                };

            case ItemActions.SET_AUTO_READ_ITEM_ID:
                return {
                    ...state,
                    folderViews: state.folderViews.map(val => val.active ? { ...val, autoReadItemId: actions.payload.itemId } : val)
                };

            case ItemActions.FLAG_ITEMS:
                return {
                    ...state,
                    folderViews: flagItems(state.folderViews, actions.payload.items, actions.payload.flag)
                };

            case Actions.CHECK_ITEM:
                return {
                    ...state,
                    folderViews: toggleItemCheck(state.folderViews, actions.payload.item)
                };

            case ItemActions.DELETE_ITEMS:
            case ItemActions.MOVE_ITEM_SUCCESS:

                return {
                    ...state, folderViews: removeItems(state.folderViews,
                        actions.payload.items.map((item) => item.data.id))
                };

            case Actions.REMOVE_ITEM_FROM_CACHE:
                return {
                    ...state, folderViews: removeItems(state.folderViews, [actions.payload.itemId])
                };

            case Actions.VIEW_ITEM:
                return {
                    ...state,
                    folderViews: viewItem(state.folderViews,
                        actions.payload.item, actions.payload.viewId)
                };

            case Actions.CLEAR_VIEWING_ITEM:
                return {
                    ...state,
                    folderViews: clearViewingItem(state.folderViews,
                        (actions as Actions.ClearViewingItem).payload.item ?
                            (actions as Actions.ClearViewingItem).payload.item.data.parentFolderId : null)
                };
            case Actions.ITEM_SELECT:
                return {
                    ...state,
                    folderViews: selectItem(state.folderViews,
                        (actions as Actions.ItemSelect).payload.item)
                };

            // case ItemActions.CACHE_ATTACHEMNT_URL_SUCCUESS:
            //     const payload = (actions as ItemActions.CacheAttachmentUrlSuccess).payload;
            //     return {
            //         ...state, folderViews: cacheAttachemnt(state.folderViews, payload.item, payload.attachemnt, payload.urlCache)
            //     };
            // case Actions.CLEAR_ALL_ITEM_CACHE: {
            //     return { ...state, folderViews: cleanAllCacheViews(state.folderViews) };
            // }

            default: { return state; }
        }
    } catch (e) {
        console.error('error in mail items reducer', e);
    }
}

const hashUtil = (hash: string) => {
    const split = () => {
        return hash.split(HASH_JOINT);
    };

    const root = () => {
        return split()[0];
    };

    const leaf = () => {
        return split()[1];
    };

    const withLeaf = (_leaf) => {
        return [root(), _leaf].join(HASH_JOINT);
    };

    return {
        split,
        root,
        leaf,
        withLeaf,
        hash: () => hash
    };
};

const viewCacheUtil = (viewCache: Readonly<ItemFilterState>) => {

    const getSortedItemIndex = (itemId: string) => {
        return viewCache.order.indexOf(itemId);
    };

    const getItemIndex = (itemId: string) => {
        return getSortedItemIndex(itemId);
    };

    const getItemIdAt = (index: number) => {
        if (index < 0 || index >= viewCache.order.length) {
            return null;
        }
        const itemId = viewCache.order[index];
        return itemId || null;
    };

    const getNextItemId = (itemId: string) => {
        const index = getSortedItemIndex(itemId);
        if (index === -1) {
            return null;
        }
        if (viewCache.order.length <= index + 1) {
            return null;
        }
        return !!viewCache.order[index + 1];
    };

    const isNextItemReady = (itemId: string) => {
        return !!getNextItemId(itemId);
    };

    const isLoading = (hashLeaf: string) => {
        return viewCache.hashLeaf
            .filter((leaf) => leaf.suffix === hashLeaf)
            .map(leaf => leaf.loading)
            .reduce((__, value) => value, false);
    };

    const isLoaded = (hashLeaf: string) => {
        return viewCache.hashLeaf
            .filter((leaf) => leaf.suffix === hashLeaf)
            .map(leaf => leaf.loaded)
            .reduce((__, value) => value, false);
    };

    const checkHash = (hash: string) => {
        return !!viewCache
            .hashLeaf
            .map((leaf) => [viewCache.hashRoot, leaf.suffix].join(HASH_JOINT))
            .find((fullHash) =>
                fullHash === hash
            );
    };

    const checkHashRoot = (fullHash: string) => {
        return hashUtil(fullHash).root() === viewCache.hashRoot;
    };

    const expandHashLeaf = (expandLeaf: (hashLeaf: string) => Partial<ItemViewState>) => {
        return viewCache.hashLeaf.map((leaf) => expandLeaf(leaf.suffix));
    };

    return {
        getSortedItemIndex,
        isNextItemReady,
        getNextItemId,
        checkHash,
        checkHashRoot,
        isLoading,
        isLoaded,
        expandHashLeaf,
        getItemIndex,
        getItemIdAt,
        viewCache: () => viewCache
        // getItemShortage: getItemShortage
    };
};

const viewStateUtil = (view: Readonly<ItemViewState>) => {

    const hashParamJoint = '|';
    const hashRootOrder = ['orderBy', 'sortDir', 'filter', 'itemPerPage',
        'search.searchText', 'search.hasAttachment', 'search.isAllFolders',
        'search.from', 'search.dateType', 'search.dateFrom', 'search.dateTo'
    ];

    const virtualScrollingToPagination = (end: number): Partial<ItemViewState> => {
        const viewCache = findActiveViewCache();
        if (!viewCache) {
            return { pageIndex: 0 };
        }
        const util = viewCacheUtil(viewCache);
        const maxLeaf = util.expandHashLeaf(expandHashLeaf)
            .reduce((accu, current) => accu.pageIndex > current.pageIndex ? accu : current);

        const nextPreLoad = Math.min(viewCache.totalItems, end + (view.itemPerPage / 2));
        const pageToLoad = Math.ceil(nextPreLoad / view.itemPerPage) - 1;
        const nextPageToLoad = Math.min(maxLeaf.pageIndex + 1, pageToLoad);

        // console.log(`
        // nextPrelaod=${nextPreLoad},
        // nextPageToLoad=${nextPageToLoad},
        // loadedLengh= ${viewCache.order.length},
        // currentMaxPage=${maxLeaf.pageIndex}`);

        return { pageIndex: Math.max(nextPageToLoad, 0) };
    };

    const accessValue = (dotParam: string, _view: Partial<Readonly<ItemViewState>>) => {
        return dotParam.split('.').reduce((obj, param) => {
            if (obj.hasOwnProperty(param)) {
                return obj[param];
            }
            return {}; // force for undefined
        }, _view);
    };

    const assignValue = (dotParam: string, _view: Partial<Readonly<ItemViewState>>, value: any) => {
        dotParam.split('.').reduce((obj, param, index, iter) => {
            if (index === iter.length - 1) {
                obj[param] = value;
            }
            if (!obj.hasOwnProperty(param)) {
                return obj[param] = {};
            }
            return obj[param];

        }, _view);
        return _view;
    };

    const getHashFromView = (_view: Partial<Readonly<ItemViewState>>) => {
        const hashRoot = hashRootOrder.reduce((values, param) =>
            values.concat([JSON.stringify(accessValue(param, _view))]), []);
        const suffix = [_view.pageIndex];
        return hashRoot.join(hashParamJoint) + HASH_JOINT + suffix.join(hashParamJoint);
    };

    const getHash = () => {
        return getHashFromView(view);
    };

    function expandHashLeaf(hashLeaf: string): Partial<ItemViewState> {
        return { pageIndex: parseInt(hashLeaf, 10) };
    }

    const expandHashRoot = (hashRoot: string): Partial<ItemViewState> => {
        const parts = hashRoot.split(hashParamJoint);
        return hashRootOrder.reduce((accu, param, index) => {
            return assignValue(param, accu, JSON.parse(parts[index]));
        }, {});
    };

    const getItemSortageRequestInfoByViewCache = (viewCache: Readonly<ItemFilterState>): ItemRequestInfo => {
        const util = viewCacheUtil(viewCache);
        const maxLeaf = util.expandHashLeaf(expandHashLeaf)
            .reduce((accu, current) => accu.pageIndex > current.pageIndex ? accu : current);
        const _view = { ...expandHashRoot(util.viewCache().hashRoot), ...maxLeaf };
        const start = util.viewCache().order.length;
        const size = Math.min(((maxLeaf.pageIndex + 1) * _view.itemPerPage), viewCache.totalItems) - start;

        return {
            ...requestInfoBase({ ...view, ..._view } as Readonly<ItemViewState>),
            size,
            start,
            hash: getHashFromView(_view)
        } as ItemRequestInfo;
    };

    const getItemSortageRequestInfo = (): ItemRequestInfo[] => {
        return view.viewCache.map((_cache) => getItemSortageRequestInfoByViewCache(_cache));
    };

    const findViewCacheByHash = (hash: string) => {
        return view.viewCache.find((_cache) => viewCacheUtil(_cache).checkHash(hash));
    };

    function findActiveViewCache(onlyRoot = false) {
        const hash = getHash();
        return view.viewCache.find((_cache) => onlyRoot === true ? viewCacheUtil(_cache).checkHashRoot(hash)
            : viewCacheUtil(_cache).checkHash(hash));
    }

    const getPaginationInfo = () => {
        return { size: view.itemPerPage, start: view.itemPerPage * view.pageIndex };
    };

    const sortKeyFunc = (viewCache: Readonly<ItemFilterState>) => {
        const { orderBy } = expandHashRoot(viewCache.hashRoot);
        switch (orderBy) {
            case OrderBy.Attachment: {
                return (item: Message) => item.hasAttachments + '|' + item.receivedDateTime;
            }

            case OrderBy.From: {
                const name = (item: Message) =>
                    item.from && item.from.emailAddress && item.from.emailAddress.name ?
                        item.from.emailAddress.name.toLowerCase() : '';
                return (item: Message) => name(item) + '|' + item.receivedDateTime;
            }

            case OrderBy.Importance: {
                return (item: Message) => (item.importance ? ['low', 'normal', 'high']
                    .indexOf(item.importance) : '') + '|' + item.receivedDateTime;
            }

            case OrderBy.Subject: {
                return (item: Message) => (item.subject && item.subject !== '' ?
                    item.subject.toLowerCase() : ' ') + '|' + item.receivedDateTime;
            }

            case OrderBy.Date:
            default: {
                return (item: Message) => item.receivedDateTime;
            }
        }
    };

    const filterInclutionFunc = (viewCache: Readonly<ItemFilterState>) => {
        // tslint:disable-next-line:no-shadowed-variable
        const { filter } = expandHashRoot(viewCache.hashRoot);
        switch (filter) {
            case FilterTypes.Flagged:
                return (item: Message) => item.flag && item.flag.flagStatus === 'flagged' ? true : false;
            case FilterTypes.Unread:
                return (item: Message) => !item.isRead;

            // todo implemnt filter types;
            case FilterTypes.All:
            default: {
                return (item: Message) => true;
            }
        }
    };

    const checkFilterInclution = (viewCache: Readonly<ItemFilterState>, item: Message) => {
        return filterInclutionFunc(viewCache)(item);
    };

    const getSortedItems = <T>(viewCache: Readonly<ItemFilterState>, start, size, map: (x: MessageItemWrapper) => T) => {
        if (viewCache.order.length) {
            return viewCache.order
                .slice(start, Math.min(start + size, viewCache.order.length))
                .filter((id) => !!id)
                .map<T>((id) => map(view.items[id]));
        }
        return [];
    };

    const getSortedIndex = (viewCache: Readonly<ItemFilterState>, item: Message) => {
        const { sortDir } = expandHashRoot(viewCache.hashRoot);
        const keyFunc = sortKeyFunc(viewCache);
        let sortedItems = getSortedItems<string>(viewCache, 0, viewCache.order.length, (x) => keyFunc(x.data));
        if (sortDir === SortDir.Desc) {
            sortedItems = sortedItems.reverse();
        }
        try {
            let insertIndex = _.sortedIndex(sortedItems, keyFunc(item));
            if (sortDir === SortDir.Desc) {
                insertIndex = sortedItems.length - insertIndex;
            }
            return insertIndex;
        } catch (e) { console.error(e); }
    };

    const findIncludeCaches = (itemId: string) => {
        return view.viewCache.filter((_cache) => _cache.order.indexOf(itemId) !== -1);
    };

    const isDefaultCacheView = (viewCache: Readonly<ItemFilterState>) => {
        const dummyView = createDefaultFolderView('dummy');
        const dummyHash = getHashFromView(dummyView);
        return viewCacheUtil(viewCache).checkHashRoot(dummyHash);
    };

    const getHashUtil = () => {
        return hashUtil(getHash());
    };

    const getSortedItemsForCurrentPage = () => {
        const viewCache = findActiveViewCache();
        if (!viewCache) { return []; }
        const { start, size } = getPaginationInfo();
        return getSortedItems<MessageItemWrapper>(viewCache, start, size, (x) => x);
    };

    const getAllSortedItemsForCurrentView = () => {
        const viewCache = findActiveViewCache(true);
        if (!viewCache) { return []; }
        return getSortedItems<MessageItemWrapper>(viewCache, 0, viewCache.order.length, (x) => x);
    };

    const getActiveViewItemIndex = (itemId: string) => {
        const viewCache = findActiveViewCache();
        if (!viewCache) { return -1; }
        return viewCacheUtil(viewCache).getItemIndex(itemId);
    };

    const getItemToView = () => {
        if (view.viewingIndex === -1) {
            return null;
        }
        const viewCache = findActiveViewCache();
        if (!viewCache) { return null; }
        const itemId = viewCacheUtil(viewCache)
            .getItemIdAt(view.viewingIndex);
        if (!itemId) { return null; }
        return view.items[itemId] || null;
    };

    const isInActiveView = (itemId: string) => {
        const viewCache = findActiveViewCache();
        if (!viewCache) { return false; }
        return viewCacheUtil(viewCache).getSortedItemIndex(itemId) > -1;
    };

    const getListViewOptionsForCurrentPage = () => {
        const pageInfo = {
            orderBy: view.orderBy,
            sortDir: view.sortDir,
            filter: view.filter,
            total: -1,
            itemPerPage: view.itemPerPage,
            pageIndex: view.pageIndex
        };
        const viewCache = findActiveViewCache();
        if (!!viewCache) {
            pageInfo.total = viewCache.totalItems;
        }
        return pageInfo;
    };

    const getActiveViewCacheUtil = () => {
        const viewCache = findActiveViewCache();
        if (!viewCache) { return null; }
        return viewCacheUtil(viewCache);
    };

    const isItemLoading = () => {
        const util = getActiveViewCacheUtil();
        if (!util) { return false; }
        return util.isLoading(getHashUtil().leaf());
    };

    const isItemLoaded = () => {
        const util = getActiveViewCacheUtil();
        if (!util) { return false; }
        return util.isLoaded(getHashUtil().leaf());
    };

    function requestInfoBase(_view: Readonly<ItemViewState>): Partial<ItemRequestInfo> {
        if ((_view.pageIndex * view.itemPerPage) < 0) {
            console.log('Problem with the view', _view);
        }

        return {
            orderBy: _view.orderBy,
            sortDir: _view.sortDir,
            start: _view.pageIndex * view.itemPerPage,
            size: _view.itemPerPage,
            filter: _view.filter,
            folderId: _view.viewId !== SEARCH_VIEWID ? view.viewId : view.search.folderId,
            dateFrom: _view.search.dateFrom,
            dateTo: _view.search.dateTo,
            dateType: _view.search.dateType,
            from: _view.search.from,
            hasAttachment: _view.search.hasAttachment,
            isAllFolders: _view.search.isAllFolders,
            isSearching: _view.viewId === SEARCH_VIEWID,
            searchText: _view.search.searchText
        };
    }

    const getAllRequestInfoForActiveViewCache = (): ItemRequestInfo[] => {
        const _view = view;
        return _.range(0, _view.pageIndex + 1)
            .map((pageIndex) => {
                const __view = { ..._view, pageIndex: pageIndex };
                return { ...requestInfoBase(__view), hash: getHashFromView(__view) } as ItemRequestInfo;
            });
    };

    const getRequestInfo = (): ItemRequestInfo => {
        return {
            ...requestInfoBase(view),
            hash: getHash()
        } as ItemRequestInfo;
    };

    const hasNextPage = () => {
        const pageInfo = getListViewOptionsForCurrentPage();
        if (pageInfo.total >= (pageInfo.pageIndex + 2) * pageInfo.itemPerPage) {
            return true;
        }
        return false;
    };

    const getNextPageRequest = () => {
        if (hasNextPage()) {
            const _view = { ...view, pageIndex: view.pageIndex + 1 } as ItemViewState;
            return viewStateUtil(_view).getRequestInfo();
        }
        return null;
    };

    return {
        getHash,
        findActiveViewCache,
        getPaginationInfo,
        getSortedItemsForCurrentPage,
        getHashUtil,
        isItemLoading,
        isItemLoaded,
        getRequestInfo,
        getItemSortageRequestInfo,
        getSortedIndex,
        findIncludeCaches,
        getListViewOptionsForCurrentPage,
        isDefaultCacheView,
        checkFilterInclution,
        getNextPageRequest,
        virtualScrollingToPagination,
        getAllSortedItemsForCurrentView,
        getActiveViewItemIndex,
        getItemToView,
        isInActiveView,
        getAllRequestInfoForActiveViewCache,
        view: () => view
    };
};


// // depricated
// function createViewRequestHash(view: ItemViewState) {
//     const prefix = [view.orderBy, view.sortDir, view.filter, view.itemPerPage];
//     const suffix = [view.pageIndex];
//     return prefix.join('|') + HASH_JOINT + suffix.join('|');
// }

// // depricted
// function splitRequestHash(hash: string) {
//     return hash.split(HASH_JOINT);
// }

function createDefaultFolderView(id: string): ItemViewState {
    return {
        viewId: id,
        active: false,
        items: {},
        viewCache: [],
        itemPerPage: 50,
        sortDir: SortDir.Desc,
        orderBy: OrderBy.Date,
        filter: FilterTypes.All,
        search: {
            from: '', dateType: SerchDateTypes.All, dateFrom: '', dateTo: '',
            searchText: '', isAllFolders: false, hasAttachment: false, folderId: ''
        },
        pageIndex: 0,
        isSearching: false,
        autoReadItemId: null,
        viewingIndex: -1
    };
}

function ensureHashLeafFlags(leafs: HashLeaf[], suffix, isLoading: boolean, isLoaded: boolean = false) {
    const has = leafs.find(leaf => leaf.suffix === suffix);
    if (!has) {
        return leafs.concat([{ suffix: suffix, loading: isLoading, loaded: isLoaded }]);
    }
    const mutation = { loading: isLoading };
    if (isLoaded !== null) {
        mutation['loaded'] = isLoaded;
    }
    return leafs.map((leaf) => leaf.suffix === suffix ? { ...leaf, ...mutation } : leaf);
}

function ensureView(folderViews: ReadonlyArray<Readonly<ItemViewState>>, viewId: string): ReadonlyArray<Readonly<ItemViewState>> {
    const has = folderViews.find((view) => view.viewId === viewId);

    if (has) {
        return folderViews;
    }

    const newViews = folderViews.concat([createDefaultFolderView(viewId)]);
    if (viewId !== SEARCH_VIEWID) {
        return newViews;
    }

    const activeView = folderViews.find((view) => {
        return view.active;
    });

    return newViews.map((view) => {

        if (view.viewId === SEARCH_VIEWID) {
            return {
                ...view,
                isSearching: true,
                active: true,
                search: {
                    ...view.search,
                    folderId: activeView.viewId
                }
            };
        }

        if (view.viewId === activeView.viewId) {
            return { ...view, active: false, isSearching: true };
        }

        return view;
    });
}

function createDefaultViewCache(fullHash: string) {
    const hUtil = hashUtil(fullHash);
    return {
        // loading: false,
        // loaded: false,
        hashRoot: hUtil.root(),
        hashLeaf: [{ suffix: hUtil.leaf(), loaded: false, loading: false }],
        lastTouch: new Date(),
        totalItems: -1,
        order: []
    };
}

function ensureViewCache(viewCacheList: ViewCacheList, hash: string) {
    const has = viewCacheList.find((view) => viewCacheUtil(view).checkHashRoot(hash));
    if (has) {
        return viewCacheList;
    }

    return viewCacheList.concat([createDefaultViewCache(hash)]);
}

function ensureViewChanges(folderViews: ReadonlyArray<Readonly<ItemViewState>>, viewId: string, changes: Actions.ListChanges) {

    const viewMutations = new Map<MessageListActions | SerchMessageListActions, (value: any, view: ItemViewState)
        => Partial<ItemViewState>>([
            [MessageListActions.Filter, (value, view: ItemViewState) => ({ filter: value, pageIndex: 0 })],
            [MessageListActions.SortDir, (value, view: ItemViewState) => ({ sortDir: value })],
            [MessageListActions.OrderBy, (value, view: ItemViewState) => ({ orderBy: value, pageIndex: 0 })],
            [MessageListActions.VirtualScroll, (value, view: ItemViewState) => {
                return viewStateUtil(view).virtualScrollingToPagination(value.end);
            }
            ],
            [MessageListActions.PageChange, (value: { pageIndex: number, itemPerPage: number }, view: ItemViewState) =>
                ({
                    pageIndex: value.pageIndex,
                    itemPerPage: value.itemPerPage
                })],
        ]);

    const searchMutations = new Map<MessageListActions | SerchMessageListActions, (value: any) => Partial<SearchOptions>>([
        [SerchMessageListActions.DateType, (value) => ({
            dateType: value.dateType,
            dateFrom: value.dateFrom,
            dateTo: value.dateTo
        })],
        [SerchMessageListActions.From, (value) => ({ from: value })],
        [SerchMessageListActions.HasAttachment, (value) => ({ hasAttachment: value })],
        [SerchMessageListActions.IsAllFolders, (value) => ({ isAllFolders: value })],
        [SerchMessageListActions.SearchText, (value) => ({ searchText: value })]
    ]);

    return ensureView(folderViews, viewId).map((view) => {

        if (view.viewId === viewId) {
            let mutated = changes.reduce((_mutated, change) => {

                if (searchMutations.has(change.kind)) {
                    const neneralMutation = {};
                    return {
                        ..._mutated,
                        pageIndex: 0,
                        search: Object.assign({}, _mutated.search || view.search,
                            searchMutations.get(change.kind)(change.value))
                    };
                }

                if (viewMutations.has(change.kind)) {
                    return { ..._mutated, ...viewMutations.get(change.kind)(change.value, view) };
                }

            }, {} as Partial<ItemViewState>);

            // if user change the item per page, then remove all filter cache and the repo
            if (mutated.itemPerPage && mutated.itemPerPage !== view.itemPerPage) {
                mutated = { ...mutated, items: {}, viewCache: [], pageIndex: 0 };
            }

            const changed = Object.keys(mutated).some((key) => mutated[key] !== view[key]);
            if (changed) {
                return { ...view, ...mutated };
            } else {
                return view;
            }
        }
        return view;
    });

}

function exitSearch(folderViews: ReadonlyArray<Readonly<ItemViewState>>) {
    const searchView = folderViews.find((view) => {
        return view.viewId === SEARCH_VIEWID;
    });
    return folderViews.map((view) => {
        if (view.viewId === searchView.search.folderId) {
            return { ...view, isSearching: false, active: true };
        }
        return view;
    })
        .filter(view => view.viewId !== SEARCH_VIEWID);
}


function mutateAllItemRefs(folderViews: ReadonlyArray<Readonly<ItemViewState>>,
    itemIds: string[], callback: (item: MessageItemWrapper) => MessageItemWrapper, viewId?: string,
    viewModifiyer: (view: ItemViewState) => ItemViewState = (x) => x):
    ReadonlyArray<Readonly<ItemViewState>> {
    return folderViews.reduce((_views, __, index) => {
        const view = _views[index];
        if (!!viewId && view.viewId !== viewId) {
            return _views;
        }

        return itemIds.filter((id) => {
            return !!view.items[id];
        }).map((id) => callback(view.items[id]))
            .reduce((accu, item, _index, iter) => {
                const mutation = { ...accu.repo, ...{ [item.data.id]: item } };
                accu.repo = mutation;
                accu.box = [mutation];
                return accu;
            }, { box: [], repo: {} })
            .box.reduce((__views, items) => {
                return __views.map((_view) => {
                    if (_view === view) {
                        return { ...viewModifiyer(view), items: { ...view.items, ...items } };
                    }
                    return _view;
                });
            }, _views);
    }, folderViews);
}

// function mutateItems(folderViews: ReadonlyArray<Readonly<ItemViewState>>,
//     itemIds: string[], callback: (item: MessageItemWrapper) => MessageItemWrapper):
//     ReadonlyArray<Readonly<ItemViewState>> {

//     const getUpdatedViews = (changedHash: { [folderId: string]: MessageItemWrapper[] },
//         currentViews: ReadonlyArray<Readonly<ItemViewState>>) =>
//         Object.freeze(currentViews.map((view) => {
//             if (changedHash[view.viewId]) {
//                 const itemHash = changedHash[view.viewId].reduce((partialHash, item) => {
//                     partialHash[item.data.id] = item;
//                     return partialHash;
//                 }, {});

//                 return Object.freeze({ ...view, items: Object.freeze({ ...view.items, ...itemHash }) });
//             }
//             return view;
//         }));

//     return getUpdatedViews(
//         groupBy(
//             itemIds
//                 .map((id) =>
//                     folderViews
//                         .filter((view) => !!view.items[id])
//                         .map((view) => view.items[id])
//                         .map((item) => callback(item))
//                         .shift()
//                 )
//                 .filter(item => !!item),
//             item => item.data.parentFolderId
//         ),
//         folderViews
//     );
// }


function cleanAllCacheViews(folderViews: ReadonlyArray<Readonly<ItemViewState>>) {
    return folderViews
        .filter((view) => view.active)
        .map((view) => {
            const oldViewUtil = viewStateUtil(view);
            const mutation = { active: true };
            const viewCache = oldViewUtil.findActiveViewCache();
            if (viewCache) {
                mutation['viewCache'] = [viewCache];
                mutation['items'] = viewCache.order.reduce((items, id) => {
                    items[id] = view.items[id];
                    return items;
                }, {});
            }
            const newview = { ...view, ...mutation };
            return newview;
        });
}

function removeFolderView(folderViews: ReadonlyArray<Readonly<ItemViewState>>, viewId: string) {
    const hasView = folderViews.find((view) => view.viewId === viewId);

    if (!hasView) {
        return folderViews;
    }
    return folderViews
        .filter((view) => view.viewId !== viewId);
}

function removeItems(folderViews: ReadonlyArray<Readonly<ItemViewState>>, ids: string[]) {
    const dirtyIds = ids.reduce((_ids, id) => ({ ..._ids, ...{ [id]: true } }), {});

    const removeItemsFromViewCache = (viewCache: Readonly<ItemFilterState>): ItemFilterState => {
        const isDirty = viewCache.order.find((id) => dirtyIds[id] === true);
        if (!isDirty) {
            return viewCache;
        }
        // save deleteed item indexes
        const newOrder = viewCache.order.filter((id) => dirtyIds[id] !== true);
        const deletedCount = viewCache.order.length - newOrder.length;
        return { ...viewCache, order: newOrder, totalItems: viewCache.totalItems - deletedCount };
    };

    const removeItemsFromFolderView = (view: Readonly<ItemViewState>) => {
        const isDirty = Object.keys(dirtyIds).find((id) => !!view.items[id]);
        if (!isDirty) {
            return view;
        }
        // is item viwing
        return { ...view, item: _.omit(view.items, ids), viewCache: view.viewCache.map((_cache) => removeItemsFromViewCache(_cache)) };
    };

    return folderViews.reduce((views, view) => {
        const newView = removeItemsFromFolderView(view);
        if (newView !== view) {
            return views.filter((_view) => _view !== view).concat([newView]);
        }
        return views;
    }, folderViews);
}

function filterItems(folderViews: ReadonlyArray<Readonly<ItemViewState>>, folderId: string,
    predicate: (item: MessageItemWrapper) => boolean): MessageItemWrapper[] {
    return folderViews
        .filter((view) => view.viewId === folderId || folderId === null)
        .map((view) =>
            Object.values(view.items)
                .filter(predicate)
        ).reduce((all, current) => all.concat(current), []);
}

// function findItem(folderViews: ReadonlyArray<Readonly<ItemViewState>>, folderId: string,
//     predicate: (item: MessageItemWrapper) => boolean): MessageItemWrapper {
//     return filterItems(folderViews, folderId, predicate)
//         .shift();
// }

const mutateViewingIndex = (viewId, itemId, view: ItemViewState): ItemViewState => {
    if (!viewId || viewId !== view.viewId) { return view; }
    const viewingIndex = viewStateUtil(view).getActiveViewItemIndex(itemId);
    if (viewingIndex === -1) {
        return view;
    }
    if (view.viewingIndex === viewingIndex) {
        return view;
    }
    return { ...view, viewingIndex: viewingIndex };
};

function viewItem(folderViews: ReadonlyArray<Readonly<ItemViewState>>,
    item: MessageItemWrapper, viewId: string): ReadonlyArray<Readonly<ItemViewState>> {
    const modification = (newItem: MessageItemWrapper, other: MessageItemWrapper) => {
        if (other === newItem) {
            return Object.freeze({ ...other, viewing: true, selected: false });
            // , selected: true
        } else {
            return Object.freeze({ ...other, viewing: false, selected: false });
        }
    };
    const current = filterItems(folderViews, viewId,
        (_item) => _item.viewing === true
            || _item.selected === true
    );
    const modifiedIds = [item, ...current].filter(_item => !!_item).map((_item) => _item.data.id);
    const partialmodification = _.partial(modification, item);

    return mutateAllItemRefs(folderViews, modifiedIds, partialmodification, viewId, _.partial(mutateViewingIndex, viewId, item.data.id));
}

function clearViewingItem(folderViews: ReadonlyArray<Readonly<ItemViewState>>, folderId?: string): ReadonlyArray<Readonly<ItemViewState>> {
    const modification = (other: MessageItemWrapper) => {
        return Object.freeze({ ...other, viewing: false });
    };
    const current = filterItems(folderViews, folderId,
        (_item) => _item.viewing === true
    );
    const modifiedIds = current.filter(_item => !!_item).map((_item) => _item.data.id);
    const mutateView = (view: ItemViewState): ItemViewState => {
        if (view.viewingIndex === -1) {
            return view;
        }
        return { ...view, viewingIndex: -1 };
    };
    return mutateAllItemRefs(folderViews, modifiedIds, modification, null, mutateView);
}

function selectItem(folderViews: ReadonlyArray<Readonly<ItemViewState>>, item: MessageItemWrapper): ReadonlyArray<Readonly<ItemViewState>> {
    const modification = (newItem: MessageItemWrapper, other: MessageItemWrapper) => {
        if (newItem === other) {
            return Object.freeze({ ...other, selected: true, viewing: false });
        } else if (other.selected) {
            return Object.freeze({ ...other, selected: false, viewing: false });
        }
        return other;
    };
    const selected = filterItems(folderViews, item.data.parentFolderId,
        (_item) => _item.selected === true
    );
    const modifiedIds = [item, ...selected].filter(_item => !!_item).map((_item) => _item.data.id);
    const partialmodification = _.partial(modification, item);
    return mutateAllItemRefs(folderViews, modifiedIds, partialmodification);
}

// function cacheAttachemnt(folderViews: ReadonlyArray<Readonly<ItemViewState>>, item: MessageItemWrapper,
//     att: FileAttachment, urlCache: FileUrlCache): ReadonlyArray<Readonly<ItemViewState>> {
//     const modification = (newItem: MessageItemWrapper) => {
//         return Object.freeze({ ...newItem, attachmentUrls: { ...newItem.attachmentUrls, ...{ [att.id]: urlCache } } });
//     };
//     const modifiedIds = [item.data.id];
//     return mutateAllItemRefs(folderViews, modifiedIds, modification);
// }

// ---------- check Item ------------------
function toggleItemCheck(folderViews: ReadonlyArray<Readonly<ItemViewState>>, item: MessageItemWrapper)
    : ReadonlyArray<Readonly<ItemViewState>> {
    const modification = (_item: MessageItemWrapper) => {
        return Object.freeze({ ..._item, selected: !_item.selected });
    };
    const modifiedIds = [item.data.id];
    // const viewId = folderViews.filter((view) => view.active).map((view) => view.viewId).find(() => true);
    return mutateAllItemRefs(folderViews, modifiedIds, modification);
}

// ---------- flag items -------------------
function flagItems(folderViews: ReadonlyArray<Readonly<ItemViewState>>,
    items: MessageItemWrapper[], flag: FollowupFlag): ReadonlyArray<Readonly<ItemViewState>> {
    const modification = _.partial((_flag: FollowupFlag, _item: MessageItemWrapper) => {
        return Object.freeze({ ..._item, data: { ..._item.data, flag: flag } });
    }, flag);
    const modifiedIds = items.filter(_item => !!_item).map((_item) => _item.data.id);
    return mutateAllItemRefs(folderViews, modifiedIds, modification);
}

// ----- Read Unread Items ----------------
function readUnreadItems(folderViews: ReadonlyArray<Readonly<ItemViewState>>,
    items: MessageItemWrapper[], isRead: boolean): ReadonlyArray<Readonly<ItemViewState>> {
    const modification = _.partial((_isRead: boolean, _item: MessageItemWrapper) => {
        return Object.freeze({ ..._item, data: { ..._item.data, isRead: _isRead } });
    }, isRead);
    const modifiedIds = items.filter(_item => !!_item).map((_item) => _item.data.id);
    return mutateAllItemRefs(folderViews, modifiedIds, modification).map(val => {
        if (val.active && val.autoReadItemId && modifiedIds.find(id => id === val.autoReadItemId)) {
            return { ...val, autoReadItemId: null };
        }
        return val;
    });
}
// set Journal Status
function setJournalStatus(folderViews: ReadonlyArray<Readonly<ItemViewState>>,
    journalStatus: { diaryId: number, emailId: string }[]): ReadonlyArray<Readonly<ItemViewState>> {
    if (journalStatus && journalStatus.length > 0) {
        return folderViews.map(view => {
            const temp: ItemMap = {};
            Object.values(view.items).forEach(item => {
                const status = journalStatus.find(val => item.data.internetMessageId.includes(val.emailId));
                if (status) {
                    temp[item.data.id] = { ...item, diaryId: status.diaryId };
                }
            });
            return { ...view, items: { ...view.items, ...temp } };
        });
    }
    return folderViews;
}
function removeJournalStatus(folderViews: ReadonlyArray<Readonly<ItemViewState>>,
    diaryIds: number[]): ReadonlyArray<Readonly<ItemViewState>> {
    if (diaryIds && diaryIds.length > 0) {
        return folderViews.map(view => {
            const temp: ItemMap = {};
            Object.values(view.items).forEach(item => {
                const status = diaryIds.find(val => item.diaryId === val);
                if (status) {
                    temp[item.data.id] = { ...item, diaryId: null };
                }
            });
            return { ...view, items: { ...view.items, ...temp } };
        });
    }
    return folderViews;
}


// ----------------------------------------------

function preItemLoad(folderViews: ReadonlyArray<Readonly<ItemViewState>>, request: MailItemRequest) {
    const viewId = request.isSearching ? SEARCH_VIEWID : request.folderId;
    return folderViews.map((view) => {
        if (view.viewId === viewId) {
            const _hUtil = hashUtil(request.requestHash);
            const viewCache = ensureViewCache(view.viewCache, _hUtil.hash()).map((_cache) => {
                const _vUtil = viewCacheUtil(_cache);
                if (_vUtil.checkHashRoot(_hUtil.hash())) {
                    const maxLength = Math.max(_cache.order.length, request.start + request.size);
                    const newOrder = _.range(0, maxLength).map((index) => {
                        if (index < _cache.order.length) {
                            return _cache.order[index];
                        }
                        return undefined;
                    });

                    // null for keep the current state of loaded
                    return {
                        ..._cache,
                        hashLeaf: ensureHashLeafFlags(_cache.hashLeaf, _hUtil.leaf(), true, null),
                        order: newOrder
                    };
                }
                return _cache;
            });
            return { ...view, viewCache: viewCache };
        }
        return view;
    });
}

function createNewItemWrapper(item: Message, wellKnownName: string | null, owner: string): MessageItemWrapper {
    const displayTo = getDisplayTo(item, wellKnownName);
    const displayColor = getDisplayColor(item, wellKnownName);
    const displayInitials = getDisplayInitials(item, wellKnownName);
    let iconIndex = '';
    let actionDate = '';
    if (item.singleValueExtendedProperties) {
        item.singleValueExtendedProperties.forEach(value => {
            switch (value.id) {
                case 'Integer 0x1080':
                    iconIndex = getIconIndex(value);
                    break;
                case 'SystemTime 0x1082':
                    actionDate = value.value;
                    break;

            }
        });
    }

    return {
        data: item,
        displayTo: displayTo,
        displayColor: displayColor,
        displayInitials: displayInitials,
        diaryId: null,
        iconIndex: iconIndex,
        actionDate: actionDate,
        folderWellKnownId: wellKnownName,
        owner
    };
}

function messageItemLoadSuccess(folderViews: ReadonlyArray<Readonly<ItemViewState>>,
    request: MailItemRequest, response: MailItemResponse): ReadonlyArray<Readonly<ItemViewState>> {
    const viewId = request.isSearching ? SEARCH_VIEWID : request.folderId;
    const wellKnownName = request.wellKnownName;
    const _hUtil = hashUtil(request.requestHash);
    const responseSize = response.items.length;

    const mergeItem = (repo: ImmutableItemMap, item: Message) => {
        return Object.assign({}, repo[item.id] ? repo[item.id] : {}, createNewItemWrapper(item, wellKnownName, request.folderOwner));
    };

    return folderViews.map((view) => {
        if (view.viewId === viewId) {

            const partialMerged = _.partial(mergeItem, view.items);
            const mutation = response.items.reduce((store, item) => {
                store.repo[item.id] = partialMerged(item);
                store.order.push(item.id);
                return store;
            }, { repo: {}, order: [] });

            const end = Math.max(request.start + request.size, request.start + responseSize);

            // mark all loaded pages as loded and make sure view cache container is created for all response items / pages
            const rangeStart = Math.floor((request.start / view.itemPerPage));
            const rangeEnd = Math.ceil((end / view.itemPerPage));
            const viewCache = _.range(rangeStart, rangeEnd)
                .reduce((_viewCache, pageIndex) => {
                    // const pageIndex = index / request.size;
                    const _xhUtil = hashUtil(_hUtil.withLeaf(pageIndex));
                    return ensureViewCache(_viewCache, _xhUtil.hash()).map((_cache) => {
                        const _vUtil = viewCacheUtil(_cache);
                        if (_vUtil.checkHashRoot(_xhUtil.hash())) {
                            // set to loading false
                            return {
                                ..._cache,
                                hashLeaf: ensureHashLeafFlags(_cache.hashLeaf, _xhUtil.leaf(), false, true),
                            };
                        }
                        return _cache;
                    }); // makesure we created the cache container info for the result data
                }, view.viewCache)
                .map((_cache) => {
                    const _vUtil = viewCacheUtil(_cache);
                    if (_vUtil.checkHashRoot(_hUtil.hash())) {
                        const newOrder = _.range(0, Math.max(end, _cache.order.length))
                            .map((index) => {
                                if (index >= request.start && index < end) {
                                    const _index = index - request.start;
                                    return mutation.order[_index];
                                }
                                return _cache.order[index];
                            });

                        return {
                            ..._cache,
                            order: newOrder,
                            totalItems: request.isFullLoad ? response.total : _cache.totalItems
                        };
                    }
                    return _cache;
                });

            return {
                ...view,
                viewCache: viewCache,
                items: { ...view.items, ...mutation.repo },
                // totalItems: response.total
            };
        }
        return view;
    });
}

function syncItemAddUpdateByEvents(folderViews: ReadonlyArray<Readonly<ItemViewState>>,
    item: Message, wellKnownName: string, owner: string) {
    return folderViews.map((view) => {
        // stuff for item owned view
        if (item && view.viewId === item.parentFolderId) {
            let _vUtil = viewStateUtil(view);
            const removedIds = [];
            let ensureItemInRepo = false; // to track if the item should added to the repo
            const viewCache = view.viewCache.map((_cache) => {
                const itemIncluded = _cache.order.indexOf(item.id) !== -1;
                let newOrder = _cache.order;
                let totalItems = _cache.totalItems;

                // should item included in the current filter
                if (_vUtil.checkFilterInclution(_cache, item)) {
                    // new item
                    if (!itemIncluded) {
                        const _sortedIndex = _vUtil.getSortedIndex(_cache, item);
                        if (_sortedIndex < _cache.order.length) {
                            ensureItemInRepo = true;
                            totalItems = totalItems + 1;
                            removedIds.push(_cache.order[_cache.order.length - 1]);
                            newOrder = _.range(0, _cache.order.length)
                                .map((_index) => {
                                    if (_index === _sortedIndex) {
                                        return item.id;
                                    } else {
                                        const __index = _index > _sortedIndex ? _index - 1 : _index;
                                        return _cache.order[__index];
                                    }
                                });
                        }
                    } else { // already in the repo so update
                        ensureItemInRepo = true;
                    }
                } else { // item not match with the filter
                    if (itemIncluded) { // should remove from the view
                        newOrder = _cache.order.filter((id) => id !== item.id);
                        totalItems = totalItems - 1;
                        removedIds.push(item.id);
                    }
                }

                if (newOrder !== _cache.order || totalItems !== _cache.totalItems) {
                    return {
                        ..._cache,
                        order: newOrder,
                        totalItems: totalItems
                    };
                }
                return _cache;
            });

            let newView = { ...view, viewCache: viewCache };

            if (ensureItemInRepo) {
                const itemsMutation = view.items[item.id] ?
                    {
                        [item.id]: {
                            ...view.items[item.id],
                            data: item,
                            displayTo: getDisplayTo(item, wellKnownName),
                            displayColor: getDisplayColor(item, wellKnownName),
                            displayInitials: getDisplayInitials(item, wellKnownName)
                        }
                    } :
                    { [item.id]: createNewItemWrapper(item, wellKnownName, owner) };
                newView = {
                    ...newView,
                    viewCache: viewCache,
                    items: {
                        ...view.items,
                        ...itemsMutation
                    }
                };
            }
            _vUtil = viewStateUtil(newView);

            const danglingIds = removedIds.filter((id) => _vUtil.findIncludeCaches(id).length === 0);
            if (danglingIds.length) {
                console.log('Removeing items', removedIds);
                newView = { ...newView, items: _.omit(newView.items, danglingIds) };
            }
            return newView;
        }
        return view;
    });
}

function getIconIndex(extendedProperty?: SingleValueLegacyExtendedProperty): string {
    switch (Number.parseInt(extendedProperty.value)) {
        case 261:
            return 'Replied mail';
        case 262:
            return 'Forwarded mail';
        // case 261:
        //     return 'Replied mail';
        // case 261:
        //     return 'Replied mail';
    }
    return '';
}
function getDisplayInitials(item: Message, wellKnownName: string): string {
    let nameInitials = '';
    const tmpItem = <EventMessage>item;
    if (tmpItem.isDraft || wellKnownName === 'sentitems') {
        if (tmpItem.toRecipients && tmpItem.toRecipients.length) {
            nameInitials = tmpItem.toRecipients[0].emailAddress.name;
        }
    } else if (tmpItem.from && tmpItem.from.emailAddress) {
        nameInitials = tmpItem.from.emailAddress.name;
    } else if (tmpItem.sender && tmpItem.sender.emailAddress) {
        nameInitials = tmpItem.sender.emailAddress.name;
    }
    return new NameInitialsPipe().transform(nameInitials);
}

function getDisplayColor(item: Message, wellKnownName: string): string {
    let colorCode = '';
    const tmpItem = <EventMessage>item;
    if (tmpItem.isDraft || wellKnownName === 'sentitems') {
        if (tmpItem.toRecipients && tmpItem.toRecipients.length) {
            colorCode = tmpItem.toRecipients[0].emailAddress.address;
        }
    } else if (tmpItem.from && tmpItem.from.emailAddress) {
        colorCode = tmpItem.from.emailAddress.address;
    } else if (tmpItem.sender && tmpItem.sender.emailAddress) {
        colorCode = tmpItem.sender.emailAddress.address;
    }
    return new RecipientColorCodePipe().transform(colorCode);
}

function getDisplayTo(item: Message, wellKnownName: string): string {
    const tmpItem = <EventMessage>item;
    let displayTo = '';
    if (tmpItem.isDraft || wellKnownName === 'sentitems') {
        if (tmpItem.toRecipients && tmpItem.toRecipients.length) {
            tmpItem.toRecipients.forEach((val, index) => {
                displayTo += val.emailAddress.name + (index === (tmpItem.toRecipients.length - 1) ? '' : '; ');
            });
        }
    } else if (tmpItem.from && tmpItem.from.emailAddress && tmpItem.from.emailAddress.name) {
        displayTo = tmpItem.from.emailAddress.name;
    } else if (tmpItem.sender && tmpItem.sender.emailAddress && tmpItem.sender.emailAddress.name) {
        displayTo = tmpItem.sender.emailAddress.name;
    } else {
        displayTo = tmpItem.subject ? tmpItem.subject : '(no subject)';
    }
    return displayTo;
}

function setActiveView(folderViews: ReadonlyArray<Readonly<ItemViewState>>, viewId: string): ReadonlyArray<Readonly<ItemViewState>> {
    return Object.freeze<ItemViewState>(folderViews.map((item) => {
        if (item.viewId === viewId) {
            return Object.freeze<ItemViewState>({ ...item, active: true });
        } else if (item.active) {
            return Object.freeze<ItemViewState>({ ...item, active: false });
        }
        return item;
    }));
}

// function getSortedItems(itemHash, order: ReadonlyArray<string>, start: number, size: number) {
//     if (order.length >= start + size) {
//         return order
//             .slice(start, start + size)
//             .filter((id) => !!id)
//             .map((id) => itemHash[id]);
//     }
//     return [];
// }

export const getMessageViews = (state: State) => state.folderViews;
export const isVertualScrolling = (state: State) => state.useVirtualScrolling;

export const getMessageViewByViewId = (viewId) =>
    createSelector(getMessageViews,
        (views) => views.find(view => view.viewId === viewId)
    );

export const getViewStateUtilByViewId = (viewId) =>
    createSelector(getMessageViewByViewId(viewId),
        (view) => !!view ? viewStateUtil(view) : null);

export const getItemFilterInfoByViewId = (viewId) =>
    createSelector(getMessageViewByViewId(viewId), ((view) => {
        if (view) {
            const util = viewStateUtil(view);
            return { folderView: view, viewCache: util.findActiveViewCache(), hash: util.getHash() };
        }
        return null;
    }));

export const getSortedItemsByViewId = (viewId) =>
    createSelector(getViewStateUtilByViewId(viewId), isVertualScrolling, (util, getAll) => {
        let r: MessageItemWrapper[] = [];
        if (util) {
            r = !getAll ? util.getSortedItemsForCurrentPage() : util.getAllSortedItemsForCurrentView();
        }
        return r;
    });

export const getNextPageItemRequestByViewId = (viewId) =>
    createSelector(getViewStateUtilByViewId(viewId), (util) => util.getNextPageRequest());

export const getSelectedItemsByViewId = (folderId) =>
    createSelector(getSortedItemsByViewId(folderId), (items) =>
        items.filter((item) => item.selected === true)
    );

export const getItemLoadingByViewId = (viewId) =>
    createSelector(getViewStateUtilByViewId(viewId), (util) => !!util ? util.isItemLoading() : false);

// use only for item viewing
export const getActiveMessageView = createSelector(getMessageViews, (views) => views.find((view) => view.active));
export const getActiveViewId = createSelector(getActiveMessageView, (view) => view ? view.viewId : null);

// deprecated
// export const getActiveViewingItem = createSelector(getActiveMessageView,
//     (view) => view ? Object.values(view.items).find(item => item && item.viewing === true) : null);

export const getViewingItemByViewId = (viewId) => createSelector(getMessageViewByViewId(viewId), (view) =>
    view ? Object.values(view.items).find(item => item && item.viewing === true) : null);

export const getItemToViewByViewId = (viewId) => createSelector(getViewStateUtilByViewId(viewId),
    (util) => !!util ? util.getItemToView() : null);

export const isItemInActiveView = (viewId, itemId) => createSelector(getViewStateUtilByViewId(viewId),
    (util) => !!util ? util.isInActiveView(itemId) : false);

export const getRequestHashByViewId = (viewId) => createSelector(getViewStateUtilByViewId(viewId), (util) =>
    util ? util.getHash() : null);

export const findItemIndex = (item: MessageItemWrapper, viewId: string) => createSelector(getSortedItemsByViewId(viewId),
    (sortedData) => item ? _.findIndex(sortedData, (_item) => _item.data.id === item.data.id) : null);

export const findNextItem = (item: MessageItemWrapper, viewId: string) => createSelector(findItemIndex(item, viewId),
    getSortedItemsByViewId(viewId),
    (index, sortedItems) => Number.isInteger(index) ? (index + 1 < sortedItems.length ? sortedItems[index + 1] : null) : null);

export const findPreviousItem = (item: MessageItemWrapper, viewId) => createSelector(findItemIndex(item, viewId),
    getSortedItemsByViewId(viewId),
    (index, sortedItems) => Number.isInteger(index) ? (index - 1 >= 0 ? sortedItems[index - 1] : null) : null);

export const findItemById = (itemId: string, viewId: string) =>
    createSelector(getMessageViewByViewId(viewId), (view) => !!view ? view.items[itemId] : undefined);

export const getHasMessageItemLoadedByViewId = (viewId) =>
    createSelector(getViewStateUtilByViewId(viewId), (util) => !!util ? util.isItemLoaded() : false);

export const getRequestInfoByViewId = (viewId) => createSelector(getViewStateUtilByViewId(viewId),
    (util) => util.getRequestInfo());

export const getAllRequestInfoForActiveViewCacheByViewId = (viewId) => createSelector(getViewStateUtilByViewId(viewId),
    (util) => util.getAllRequestInfoForActiveViewCache());

// export const getActiveViewIsSearching = createSelector(getActiveMessageView, (view) => view ? view.isSearching : false);

export const getIsInSearchModeByViewId = (viewId) =>
    createSelector(getMessageViewByViewId(viewId), (view) => !!view ? view.isSearching : false);

export const getViewIdByFolderId = (folderId) => createSelector(getMessageViewByViewId(folderId), (view) => {
    if (view) {
        if (view.isSearching) {
            return SEARCH_VIEWID;
        }
        return view.viewId;
    }
    return null;
});

export const getListViewOptionsByViewId = (viewId) => createSelector(getViewStateUtilByViewId(viewId), (util) => {
    if (util) {
        return util.getListViewOptionsForCurrentPage();
    }
    return null;
});

export const getAllItemSortageRequests = createSelector(getMessageViews, (views) =>
    views.map((view) => viewStateUtil(view).getItemSortageRequestInfo())
        .reduce((all, current) => all.concat(current), [])
        .filter((info) => info.size > 0)
);

export const getAutoReadItemId = createSelector(getActiveMessageView, (view) => view ? view.autoReadItemId : null);
