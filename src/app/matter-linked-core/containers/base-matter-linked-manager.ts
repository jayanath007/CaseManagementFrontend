import {
    getColumnDefByToken, getMultiselectItemTokenByToken, getPlotRangeTokenByToken,
    getPlotSyncSuccessInfoByToken
} from './../../matter-linked-core/reducers/index';
import { ColumnDef } from './../../core/lib/grid-model';
import {
    InitMatterLinked, CreateLinkedMatter, LinkedMatterOpenCase, SelectedLinkMatter,
    SavePlotSaleScreenData, SelectedAllLinkMatter, MultiSelectMatter, RequestAddDiaryChaserData, ChangePlotRange, ChangeMatterData
} from '../actions/core';
import { Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatterDataInput } from '../models/interfaces';
import { createDefultColumnDef } from './../../core/lib/grid-helpers';
import { getGridDataByToken, getSelectedMatterDataByToken, getLoadingByToken } from '../reducers';
import { MatterLinkedType } from '../models/enum';
import { MatterSearchGridData } from './../../core/lib/matter';


export class BaseMatterLinkedManager {
    @Output() closePopup = new EventEmitter<any>();

    public myToken: string;
    public matterRef: any;
    public onlySelectMatter: boolean;
    public isLoading$: any;
    public gridData$: any;
    public coloumnDef$: any;
    public selectedMatter$: any;
    public multiSelectItem$: any;
    public plotRange$: any;
    public plotSyncSuccessInfo$: any;




    constructor(protected store: Store<any>) {
    }

    docMatterLinkedGridColumn: ColumnDef[] = [
        createDefultColumnDef('select', { label: 'Selected', fxFlex: '60px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('documentRef', { label: 'Ref', fxFlex: '100px', filterAnchor: 'start', filterHidden: true }),
        createDefultColumnDef('location', { label: 'Details', fxFlex: '', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('reviewDate', { label: 'Open', fxFlex: '90px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('destroyDate', { label: 'Last Used', fxFlex: '150px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('destroyDate', { label: 'Start Date', fxFlex: '80px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('destroyDate', { label: 'F/E', fxFlex: '50px', filterAnchor: 'end', filterHidden: true }),
    ];

    docMatterSelectedColumn: ColumnDef[] = [
        createDefultColumnDef('select', { label: 'Selected', fxFlex: '60px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('documentRef', { label: 'Ref', fxFlex: '100px', filterAnchor: 'start', filterHidden: true }),
        createDefultColumnDef('location', { label: 'Details', fxFlex: '', filterAnchor: 'end', filterHidden: true }),
    ];

    protected initSelectors(myToken: string, matterRef: string, openFrom: MatterLinkedType,
        onlySelectMatter: boolean, matterData: MatterDataInput, screenId?: any, diaryIds?: any, parentToken: string = '') {

        this.myToken = myToken;
        this.matterRef = matterRef;
        this.isLoading$ = this.store.select(getLoadingByToken(myToken));
        this.coloumnDef$ = this.store.select(getColumnDefByToken(myToken));
        this.gridData$ = this.store.select(getGridDataByToken(myToken));
        this.selectedMatter$ = this.store.select(getSelectedMatterDataByToken(myToken));
        this.multiSelectItem$ = this.store.select(getMultiselectItemTokenByToken(myToken));
        this.plotRange$ = this.store.select(getPlotRangeTokenByToken(myToken));
        this.plotSyncSuccessInfo$ = this.store.select(getPlotSyncSuccessInfoByToken(myToken));


        this.store.dispatch(new InitMatterLinked(myToken,
            {
                matterRef: matterRef,
                openFrom: openFrom,
                coloumnDef: onlySelectMatter ? this.docMatterSelectedColumn : this.docMatterLinkedGridColumn,
                // matterData && matterData.isPlotMasterMatter ? this.docMatterLinkedGridColumn
                //         : this.docMatterLinkedGridColumn.filter(c => c.fieldName !== 'select'),
                matterData: matterData,
                screenId: screenId,
                diaryIds: diaryIds,
                parentToken: parentToken,
                onlySelectMatter: onlySelectMatter
            }));

    }


    createLinkedMatter(plotNumbers: string) {
        this.store.dispatch(new CreateLinkedMatter(this.myToken, plotNumbers));
    }

    close() {

        this.closePopup.emit();
    }

    openLinkedMatter(rowData) {
        this.store.dispatch(new LinkedMatterOpenCase(this.myToken, rowData));
    }

    onSelectedMatter(value) {

        this.store.dispatch(new SelectedLinkMatter(this.myToken, value));
    }

    onSavePlotSaleScreenData() {
        this.store.dispatch(new SavePlotSaleScreenData(this.myToken));
        //  this.close();
    }

    onSelectAllMatter(value) {
        this.store.dispatch(new SelectedAllLinkMatter(this.myToken, value));
    }

    onMultiSelectMatter(value) {

        this.store.dispatch(new MultiSelectMatter(this.myToken, value));

    }

    onChangePlotRange(value) {

        this.store.dispatch(new ChangePlotRange(this.myToken, value));

    }

    onChangeMatterData(matterData) {

        this.store.dispatch(new ChangeMatterData(this.myToken, matterData));

    }

    // onSaveDiaryChaser(event) {
    //     this.store.dispatch(new RequestAddDiaryChaserData(this.myToken));
    //     //    // this.close();

    // }


}
