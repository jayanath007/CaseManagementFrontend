import { DPSResponse } from '../../core/lib/data-response';
import { ScreenDesingnerComponent } from '../../screen-desingner-desktop/components/screen-desingner/screen-desingner.component';

///////////// LookupFiles ///////////////

export class LookupFilesRequest {
    constructor(public appId: number) {

    }
    public toPost() {
        return {};
    }
}
export interface LookupFiles {

}
export type LookupFilesResponse = DPSResponse<LookupFiles>;
///////////// LookupFiles ///////////////


///////////// UpdateLookupFile ///////////////
export interface UpdateLookupFile {}
export class UpdateLookupFileRequest {
    constructor(public fileName: string, public appId: number, public fileContent: string[]) { }
    public toPost() {
        return {};
    }
}
export type UpdateLookupFileResponse = DPSResponse<UpdateLookupFile>;

///////////// IUpdateLookupFile ///////////////


///////// GetLookupFileContent //////////
export interface LookupFileContent {
}
export class LookupFileContentRequest {
    constructor(public fileName: string, public appId: number) { }
    public toPost() {
        return {};
    }
}
export type LookupFileContentResponse = DPSResponse<LookupFileContent>;
///////// GetLookupFileContent //////////

///////// DeleteFieldProperty //////////
export interface DeleteFieldProperty {
}
export class DeleteFieldPropertyRequest {
    constructor(public screenDesingnerComponent: ScreenDesingnerComponent) { }
    public toPost() {
        return {};
    }
}
export type DeleteFieldPropertyResponse = DPSResponse<DeleteFieldProperty>;
///////// DeleteFieldProperty //////////
