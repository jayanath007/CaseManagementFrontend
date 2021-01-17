import {
        AggregatorViewModel,
        DetailStatusViewModel,
        ContactScreenItemWrapper,
        ContactFieldDef,
        UnlinkContactViewModel
    } from './interface';
import { MatterInfo } from '../../core/lib/matter';

export interface ContactScreenResponse {
    aggregates: Array<AggregatorViewModel>;
    status: string;
    messageBody: string;
    messageHeader: string;
    detailStatus: DetailStatusViewModel[];
  }
  export interface GetSearchFieldsReponse extends ContactScreenResponse {
    defaultContactFields: ContactFieldDef[];
    mappedContactFields: ContactFieldDef[];
  }
  export interface ContactSearchResponse extends  ContactScreenResponse {
    contactViewModels: ContactScreenItemWrapper[];
  }
  export interface MattersForContactResponse extends ContactScreenResponse {
    data: MatterInfo[];
  }
  export interface UnlinkContactResponse extends ContactScreenResponse {
      data: UnlinkContactViewModel;
  }

