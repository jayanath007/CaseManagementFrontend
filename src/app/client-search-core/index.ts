export { ClientSearchPopupData, ClientGridRowRapper } from './models/interfaces';
export {
    InitClientSearch, ClientSearchSubmit, ClientSearchTextChange, ExpandClientRow, ExpandMatterRow, ChangeMatterPage
} from './actions/core';
export {
    getClientSearchViewByToken, getClientSearchGridDataByToken, getClientSearchGridDataLoadingStateByToken,
    getClientSearchClientColumnDefByToken, getClientSearchTextByToken, getClientSearchClientPaginatorDefByToken,
    getClientSearchMatterColumnDefByToken, getClientSearchTotalClientsByToken, getClientPopupInutDataByToken,
    getClientIsPopupInutByToken, getClientByClietRef

} from './reducers';

export { ClientPopupType } from './models/enums';
