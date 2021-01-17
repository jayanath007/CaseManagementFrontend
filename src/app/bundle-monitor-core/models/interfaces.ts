import { ColumnDef } from '../../core/lib/grid-model';
import { PDFBundleHeaderViewModel } from '../../core/lib/bundle';

export interface BundleMonitorInput {
    colunDef: ColumnDef[];
    bundleID?: number;
}

export interface DataListResponce {
    data: PDFBundleHeaderViewModel[];
    detailStatus: any;
    messageBody: string;
    messageHeader: string;
    status: string;
}


