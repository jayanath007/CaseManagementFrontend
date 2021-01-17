import { DPSResponse } from '../../core/lib/data-response';
import { OvItem } from './application-component';


export interface SaveOvItemResponseData {


}
export class SaveOvItemRequest {
    constructor(public ovItem: OvItem) {
    }
}
export type SaveOvItemResponse = DPSResponse<SaveOvItemResponseData>;

export interface DeleteOvItemResponseData {

}
export class DeleteOvItemRequest {
    constructor(public ovItems: OvItem[]) {
    }
}
export type DeleteOvItemResponse = DPSResponse<DeleteOvItemResponseData>;


export interface ExportOvItemResponseData {

}
export class ExportOvItemRequest {
    constructor(public appID, public currentScreenNo) {
    }
}
export type ExportOvItemResponse = DPSResponse<ExportOvItemResponseData>;

