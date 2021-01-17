import { DataSourceRequestViewModel, ColumnDef } from '../../core/lib/grid-model';

export class GridRequest {
    constructor(public dataSourceInfo: DataSourceRequestViewModel,
        public timeRecordedFilter: TimeRecordedFilterModel) { }

    public GridRequestToPost() {
        return {
            dataSourceRequestViewModel: this.dataSourceInfo,
            filterOptionViewModel: this.timeRecordedFilter
        };
    }
}


export class TimeRecordedFilterModel {
    dateFrom: string | Date;
    dateTo: string | Date;
    type: number;
    user: string;
    departmentId: number;
    searchText: string;
    isBillDate: boolean;
}

export class GridExportRequest extends GridRequest {
    constructor(public dataSourceInfo: DataSourceRequestViewModel,
        public timeRecordedFilter: TimeRecordedFilterModel, public columnDef: ColumnDef[]) {
        super(dataSourceInfo, timeRecordedFilter);
    }
    public ExportRequestToPost() {
        return {
            TimeRecordedTimesRequestViewModel: this.GridRequestToPost(),
            TimeRecordFieldsViewModel: this.columnDef.map(i =>
                ({ FieldName: i.fieldName, LabelName: i.extras.label, width: this.calWidth(i.extras.fxFlex) }))
        };
    }
    private calWidth(fxFlexValue: string): string {
        if (!!fxFlexValue && fxFlexValue.endsWith('px')) {
            return fxFlexValue;
        } else if (!!fxFlexValue && !fxFlexValue.endsWith('px')) {
            return ((parseInt(fxFlexValue, 0) * 250) / 10).toString() + 'px';
        } else {
            return '500px';
        }


    }

}
